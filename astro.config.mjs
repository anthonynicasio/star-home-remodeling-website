// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://starhrc.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap(),
    icon({
      include: {
        lucide: ['*'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  security: {
    csp: true,
  },
  // Bricolage Grotesque: characterful display without the AI-default serif pairing.
  // Hanken Grotesk: clean, readable body at small sizes.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      weights: [600, 700],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
    },
  ],
});
