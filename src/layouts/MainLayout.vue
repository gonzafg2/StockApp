<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-10">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Control de Existencias
        </q-toolbar-title>

        <q-icon style="font-size: 1.25rem" name="code" />
        
        <div class="q-px-sm"><a style="font-size: inherit; color: inherit; text-decoration: none;" href="https://flemingtech.us">Fleming Science & Technologies</a></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Enlaces de Interés
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'STOCK',
          caption: 'Inventario de Productos',
          icon: 'assignment_turned_in',
          link: '/#'
        },
        {
          title: 'ENTRADAS',
          caption: 'Compra o traslado interno',
          icon: 'trending_down',
          link: '/entradas'
        },
        {
          title: 'SALIDAS',
          caption: 'Venta o traslado interno',
          icon: 'trending_up',
          link: '/salidas'
        },
        // {
        //   title: 'Forum',
        //   caption: 'forum.quasar.dev',
        //   icon: 'record_voice_over',
        //   link: 'https://forum.quasar.dev'
        // },
        // {
        //   title: 'Twitter',
        //   caption: '@quasarframework',
        //   icon: 'rss_feed',
        //   link: 'https://twitter.quasar.dev'
        // },
        // {
        //   title: 'Facebook',
        //   caption: '@QuasarFramework',
        //   icon: 'public',
        //   link: 'https://facebook.quasar.dev'
        // },
        // {
        //   title: 'Quasar Awesome',
        //   caption: 'Community Quasar projects',
        //   icon: 'favorite',
        //   link: 'https://awesome.quasar.dev'
        // }
      ]
    }
  }
}
</script>
