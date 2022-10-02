// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  nitro: {
    routes: {
      '/articles': { swr: 360 },
      '/blog/**': { static: true },
    },
  },
  hooks: {
    'nitro:config'(nitroOptions) {
      if (nitroOptions.dev) return;

      nitroOptions.entry = '~/dynamic-builder';
      nitroOptions.preset = 'netlify';
    },
  },
});
