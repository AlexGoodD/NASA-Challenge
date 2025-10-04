/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import * as LucideIcons from 'lucide-vue-next'

const appName = import.meta.env.VITE_APP_NAME || 'Will It Rain On My Parade?'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    const vueApp = createApp({ render: () => h(App, props) })

    vueApp.use(plugin)

    Object.entries(LucideIcons).forEach(([name, component]) => {
      vueApp.component(name, component)
    })

    vueApp.mount(el)
  },
})
