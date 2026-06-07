import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.faktenschmied.de',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
