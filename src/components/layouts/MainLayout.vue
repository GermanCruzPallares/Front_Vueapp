<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const drawer = ref(false);

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const toggleLocale = () => {
  locale.value = locale.value === "es" ? "en" : "es";
};
</script>

<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item
        prepend-icon="mdi-home"
        :title="t('message.home')"
        to="/"
      ></v-list-item>
      <v-list-item
        v-if="authStore.isAuthenticated"
        prepend-icon="mdi-shape"
        :title="t('message.categories')"
        to="/categories"
      ></v-list-item>
      <v-list-item
        v-if="authStore.isAuthenticated"
        prepend-icon="mdi-shoe-sneaker"
        :title="t('message.products')"
        to="/products"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="primary" density="compact">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Vue Shoes Shop</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleLocale">
      <v-icon>mdi-translate</v-icon>
    </v-btn>

    <v-btn v-if="authStore.isAuthenticated" icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <v-btn v-else to="/login" variant="text">
      {{ t("message.login") }}
    </v-btn>
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <RouterView />
    </v-container>
  </v-main>

  <v-footer app border class="justify-center">
    <span class="text-caption text-grey">
      &copy; {{ new Date().getFullYear() }} - Vue 3 Backend Project
    </span>
  </v-footer>
</template>
