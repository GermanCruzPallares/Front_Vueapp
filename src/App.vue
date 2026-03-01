<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { useTheme } from "vuetify";

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();
const theme = useTheme();

// Apply theme to global Vuetify state
watch(
  () => uiStore.theme,
  (newTheme) => {
    theme.global.name.value = newTheme;
  },
  { immediate: true },
);

const layouts: Record<string, any> = {
  MainLayout: defineAsyncComponent(
    () => import("@/components/layouts/MainLayout.vue"),
  ),
  BlankLayout: defineAsyncComponent(
    () => import("@/components/layouts/BlankLayout.vue"),
  ),
  AdminLayout: defineAsyncComponent(
    () => import("@/components/layouts/AdminLayout.vue"),
  ),
};

const layout = computed(
  () => layouts[route.meta.layout as string] || layouts.MainLayout,
);

onMounted(() => {
  authStore.loadUserFromStorage();
});
</script>

<template>
  <v-app :theme="uiStore.theme">
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<style>
/* Global styles can go here */
</style>
