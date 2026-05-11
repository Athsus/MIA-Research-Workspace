import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const reportsDir = path.resolve(__dirname, '../reports')

// Serve /reports/* from the local reports directory during dev
function serveReports() {
  return {
    name: 'serve-reports',
    configureServer(server: any) {
      server.middlewares.use('/reports', (req: any, res: any, next: any) => {
        const filePath = path.join(reportsDir, req.url)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader('Cache-Control', 'public, max-age=3600')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/MIA-Research-Workspace/' : '/',
  plugins: [react(), serveReports()],
})
