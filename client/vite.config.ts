import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  envPrefix: 'DURING',
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
