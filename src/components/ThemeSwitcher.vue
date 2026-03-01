<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
</script>

<template>
  <v-btn
    icon
    @click="uiStore.toggleTheme"
    :color="uiStore.theme === 'light' ? 'amber' : 'indigo-lighten-4'"
  >
    <v-icon>
      {{
        uiStore.theme === "light" ? "mdi-weather-sunny" : "mdi-weather-night"
      }}
    </v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{
        uiStore.theme === "light" ? $t("message.toDark") : $t("message.toLight")
      }}
    </v-tooltip>
  </v-btn>
</template>
