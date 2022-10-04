import { join } from 'pathe'
import { existsSync, readFileSync, writeFileSync } from 'fs'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  nitro: {
    routes: {
      '/articles': { swr: 60 },
      '/blog/**': { static: true },
    },
    hooks: {
      async 'compiled' (nitro) {
        if (nitro.options.dev) return

        const redirectsPath = join(nitro.options.output.publicDir, '_redirects')
        let contents = '/* /.netlify/functions/server 200'
        if (existsSync(redirectsPath)) {
          contents = readFileSync(redirectsPath, 'utf-8')
        }
        for (const [key] of Object.entries(nitro.options.routes).filter(([_, value]) => value.swr || value.static)) {
          contents = `${key.replace('/**', '/*')}\t/.netlify/builders/server 200\n` + contents
        }
        writeFileSync(redirectsPath, contents)
      },
    }
  },
  hooks: {
    'nitro:config' (nitroOptions) {
      if (nitroOptions.dev) return

      nitroOptions.entry = '~/dynamic-builder'
      nitroOptions.preset = 'netlify'
    },
  },
})
