import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const envValue = (name) => {
  const value = process.env[name];
  return value == null ? 'undefined' : JSON.stringify(value);
};

export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  output: 'server',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'next/link': fileURLToPath(new URL('./src/shims/next-link.jsx', import.meta.url)),
        'next/navigation': fileURLToPath(new URL('./src/shims/next-navigation.js', import.meta.url)),
      },
    },
    define: {
      'process.env.NEXT_PUBLIC_PRIVATE_POKER_CHAIN': envValue('NEXT_PUBLIC_PRIVATE_POKER_CHAIN'),
      'process.env.NEXT_PUBLIC_PRIVATE_MESH_URL': envValue('NEXT_PUBLIC_PRIVATE_MESH_URL'),
      'process.env.NEXT_PUBLIC_PRIVATE_MESH_SIGNAL_URL': envValue('NEXT_PUBLIC_PRIVATE_MESH_SIGNAL_URL'),
    },
    server: {
      proxy: {
        '/local-rpc': {
          target: 'http://127.0.0.1:8547',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/local-rpc/, ''),
        },
      },
    },
  },
});
