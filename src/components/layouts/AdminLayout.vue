<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useUiStore } from "@/stores/ui.store";

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const drawer = ref(true);

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <v-navigation-drawer v-model="drawer" app color="grey-darken-4">
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        :title="t('message.dashboard')"
        to="/admin/dashboard"
      ></v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item
        prepend-icon="mdi-shape"
        :title="t('message.categories')"
        to="/admin/categories"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-shoe-sneaker"
        :title="t('message.products')"
        to="/admin/products"
      ></v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item
        prepend-icon="mdi-arrow-left"
        :title="t('message.home')"
        to="/"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="secondary" density="compact" dark elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title class="font-weight-black">{{
      t("message.adminPanel")
    }}</v-app-bar-title>

    <v-spacer></v-spacer>

    <LanguageSwitcher />

    <v-chip class="ma-2" color="white" label text-color="secondary">
      <v-icon start icon="mdi-account-star"></v-icon>
      {{ authStore.user?.username }}
    </v-chip>

    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6">
      <RouterView />
    </v-container>
  </v-main>

  <v-footer
    app
    border
    color="grey-darken-3"
    class="text-white justify-center py-2"
  >
    <div class="text-caption text-uppercase font-weight-bold">
      {{ t("message.adminMode") }} &bull; {{ new Date().getFullYear() }} &bull;
      {{ t("message.secureEnv") }}
    </div>
  </v-footer>

  <!-- Global Snackbar -->
  <v-snackbar
    v-model="uiStore.snackbar.show"
    :color="uiStore.snackbar.color"
    location="top"
    timeout="3000"
  >
    {{ uiStore.snackbar.text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="uiStore.snackbar.show = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>
