"""Run PETAL (USENIX 2024 replication) at 1000+1000 on the ngram13_0.8 split for
subsets that are missing it, so Fig 2 can show PETAL on all four panels.

Currently cached at 1000+1000: dm only. This fills github / hackernews / pile_cc.

Reuses the EXACT PETAL algorithm of
  report_20260524_111521_baseline_PETAL_formal_method_performance/run_petal.py
(verbatim functions), only parameterising the subset. Writes per-sample caches
into that baseline report's cache dir, with the SAME naming the figure loader
expects:  petal_<subset>_pythia-70m-deduped_step143000_vs_gpt2-xl.jsonl
so alignment by (label, idx) with the per-token lambda_c cache holds.

Resumable: re-running skips samples already in the cache.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time
from pathlib import Path

import numpy as np
import torch
from sklearn.metrics import roc_auc_score
from tqdm import tqdm
from transformers import AutoModelForCausalLM, AutoTokenizer

PROJECT = Path("/home/aoyu/repli/Curvature-Clues/mia-llm-research")
sys.path.insert(0, str(PROJECT))
from src.llm_utils import load_mimir_texts  # noqa: E402

# cache co-located with the existing dm PETAL run (figure loader reads here)
BASELINE_CACHE = (PROJECT / "reports"
                  / "report_20260524_111521_baseline_PETAL_formal_method_performance"
                  / "cache")

TARGET_MODEL = "EleutherAI/pythia-70m-deduped"
TARGET_REV = "step143000"
SURROGATE_MODEL = "openai-community/gpt2-xl"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
LENGTH_WORDS = 32
N_PER_LABEL = 1000
DTYPE = torch.float16
SEED = 42


def truncate_to_words(text, n):
    return " ".join(text.split()[:n])


def calc_text_similarity(model, tokenizer, embed_model, text, device):
    ids = tokenizer.encode(text, return_tensors="pt").to(device)
    T = ids.shape[1]
    sims = []
    for k in range(1, T):
        prefix = ids[:, :k]
        with torch.no_grad():
            out = model.generate(
                input_ids=prefix, attention_mask=torch.ones_like(prefix),
                do_sample=False, max_new_tokens=1,
                pad_token_id=tokenizer.eos_token_id,
            )
        gen_tok = out[0, -1].item()
        true_tok = ids[0, k].item()
        emb_gen = embed_model.encode(tokenizer.decode([gen_tok]), normalize_embeddings=True)
        emb_true = embed_model.encode(tokenizer.decode([true_tok]), normalize_embeddings=True)
        sims.append(math.log(max(float(np.dot(emb_gen, emb_true)), 1e-16)))
    return sims


def calc_log_probs(model, tokenizer, text, device):
    ids = tokenizer.encode(text, return_tensors="pt").to(device)
    with torch.no_grad():
        out = model(ids, labels=ids)
    log_probs = torch.nn.functional.log_softmax(out.logits, dim=-1)
    T = ids.shape[1]
    return [log_probs[0, k - 1, ids[0, k]].item() for k in range(1, T)]


def load_one(name, revision=None, dtype=DTYPE):
    kwargs = dict(torch_dtype=dtype, device_map="auto")
    if revision:
        kwargs["revision"] = revision
    model = AutoModelForCausalLM.from_pretrained(name, **kwargs)
    model.eval()
    tok = AutoTokenizer.from_pretrained(name, revision=revision) if revision \
        else AutoTokenizer.from_pretrained(name)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token
    return model, tok


def load_embed_model():
    from sentence_transformers import SentenceTransformer
    m = SentenceTransformer(EMBED_MODEL, device="cuda" if torch.cuda.is_available() else "cpu")
    m.eval()
    return m


def run_subset(dataset, target_model, tok_t, surr_model, tok_s, embed):
    surr_tag = SURROGATE_MODEL.split("/")[-1]
    target_tag = TARGET_MODEL.split("/")[-1]
    tag = f"petal_{dataset}_{target_tag}_{TARGET_REV}_vs_{surr_tag}"
    cache_path = BASELINE_CACHE / f"{tag}.jsonl"
    cache_path.parent.mkdir(parents=True, exist_ok=True)

    done = {}
    if cache_path.exists():
        for line in open(cache_path):
            line = line.strip()
            if line:
                r = json.loads(line)
                done[(r["label"], r["idx"])] = r
    print(f"[{dataset}] resumed {len(done)} cached", flush=True)

    members = load_mimir_texts(dataset, label=1, n=N_PER_LABEL, start=0)
    nonmembers = load_mimir_texts(dataset, label=0, n=N_PER_LABEL, start=0)
    samples = [(i, 1, t) for i, t in enumerate(members)] + \
              [(i, 0, t) for i, t in enumerate(nonmembers)]
    todo = [s for s in samples if (s[1], s[0]) not in done]
    print(f"[{dataset}] {len(members)} mem + {len(nonmembers)} non; {len(todo)} to run", flush=True)

    device_t = next(target_model.parameters()).device
    device_s = next(surr_model.parameters()).device
    cache_f = open(cache_path, "a")
    for n, (idx, label, full_text) in enumerate(tqdm(todo, desc=f"PETAL[{dataset}]")):
        text = truncate_to_words(full_text, LENGTH_WORDS)
        t0 = time.time()
        try:
            sim_s = calc_text_similarity(surr_model, tok_s, embed, text, device_s)
            lp_s = calc_log_probs(surr_model, tok_s, text, device_s)
            if len(sim_s) < 2 or len(lp_s) != len(sim_s):
                continue
            slope, intercept = np.polyfit(np.array(sim_s), np.array(lp_s), 1)
            sim_t = calc_text_similarity(target_model, tok_t, embed, text, device_t)
            est_lp = [s * slope + intercept for s in sim_t]
            score = -float(np.mean(est_lp))
            base_loss = -float(np.mean(calc_log_probs(target_model, tok_t, text, device_t)))
        except Exception as e:
            print(f"  ERR [{label} {idx}]: {type(e).__name__}: {e}", flush=True)
            continue
        rec = {
            "idx": int(idx), "label": int(label),
            "T_surr": len(sim_s), "T_targ": len(sim_t),
            "slope": float(slope), "intercept": float(intercept),
            "petal_score": float(score),
            "mean_est_logprob": float(np.mean(est_lp)),
            "target_mean_logprob_true": -float(base_loss),
            "time_s": round(time.time() - t0, 2),
        }
        done[(label, idx)] = rec
        cache_f.write(json.dumps(rec) + "\n"); cache_f.flush()
        if (n + 1) % 100 == 0:
            sc = list(done.values())
            lab = np.array([r["label"] for r in sc])
            ps = np.array([r["petal_score"] for r in sc])
            if len(set(lab.tolist())) == 2:
                a = roc_auc_score(lab, -ps)
                tqdm.write(f"  [{dataset} {n+1}/{len(todo)}] PETAL AUROC={max(a,1-a):.4f} (n={len(sc)})")
    cache_f.close()

    records = sorted(done.values(), key=lambda r: (r["label"], r["idx"]))
    lab = np.array([r["label"] for r in records])
    ps = np.array([r["petal_score"] for r in records])
    a = roc_auc_score(lab, -ps)
    print(f"[{dataset}] FINAL PETAL AUROC={max(a,1-a):.4f}  n={len(records)}", flush=True)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--datasets", nargs="+", default=["github", "hackernews", "pile_cc"])
    args = p.parse_args()
    torch.manual_seed(SEED); np.random.seed(SEED)
    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

    print(f"Loading models: target={TARGET_MODEL}@{TARGET_REV} surr={SURROGATE_MODEL} embed={EMBED_MODEL}", flush=True)
    target_model, tok_t = load_one(TARGET_MODEL, revision=TARGET_REV)
    surr_model, tok_s = load_one(SURROGATE_MODEL)
    embed = load_embed_model()
    print("models loaded", flush=True)

    for ds in args.datasets:
        run_subset(ds, target_model, tok_t, surr_model, tok_s, embed)


if __name__ == "__main__":
    main()
