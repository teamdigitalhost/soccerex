import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

const buildSha = process.env.COMMIT_REF || (() => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return 'unknown'
  }
})()

export default defineConfig({
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'emit-version-json',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ sha: buildSha }),
        })
      },
    },
    {
      name: 'inject-build-meta',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<meta name="build-sha" content="${buildSha}">\n</head>`,
        )
      },
    },
  ],
  server: {
    port: 5173,
    allowedHosts: ['soccerex.front'],
  },
})
