import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { viteElectronDev } from './plugins/vite.electron.dev'
import { viteElectronTest } from './plugins/vite.electron.test'
import { viteElectronBuild } from './plugins/vite.electron.build'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ prefix: 'Icon', })
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ enabledCollections: ['ep'] })
      ],
    }),
    viteElectronDev(),
    viteElectronTest(),
    viteElectronBuild(),
    Icons({ autoInstall: true }),
  ],

  base: "./", // 默认绝对路径，改成相对路径
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
