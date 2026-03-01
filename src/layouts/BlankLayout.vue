<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <v-main
    class="d-flex align-center justify-center bg-grey-lighten-4"
    style="min-height: 100vh"
  >
    <RouterView />
  </v-main>
</template>
