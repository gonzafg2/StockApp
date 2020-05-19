<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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

        <div>Kipreos Ingenieros</div>
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
          title: 'ENTRADAS',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'SALIDAS',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'STOCK',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
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
