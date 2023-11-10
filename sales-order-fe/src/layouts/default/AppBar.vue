<template>
  <v-app-bar color="primary">


    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>Solace Sales Order Demo</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer color="secondary" v-model="drawer">
    <v-sheet
      color="grey-lighten-4"
      class="pa-4"
    >
      <v-avatar
        class="mb-4"
        color="grey-darken-1"
        size="64"
      ></v-avatar>

      <div>Solace Demo</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-for="[icon, text, path] in links"
        :key="icon"
        :prepend-icon="icon"
        :title="text"
        :to="path"
        @click="drawer = !drawer"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {ref} from 'vue'

const drawer = ref(false)

const links = [
  ['mdi-home', 'Home', '/'],
  ['mdi-alert-circle', 'Invalid Messages', '/browser'],
]


</script>
