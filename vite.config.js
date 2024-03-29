import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3002
  },
  resolve: {
    alias: [
      {
        find: "@", replacement: resolve(__dirname, "/src")
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/mixins.scss";`
      }
    }
  }
});
