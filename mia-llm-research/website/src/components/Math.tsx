import katex from 'katex'

interface MathProps {
  tex: string
  display?: boolean
}

export default function Math({ tex, display = false }: MathProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    trust: false,
  })
  if (display) {
    return (
      <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
