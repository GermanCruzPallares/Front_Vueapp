<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const route = useRoute();
const authStore = useAuthStore();

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
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<style>
/* Global styles can go here */
</style>
