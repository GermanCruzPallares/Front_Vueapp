<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="7">
      <v-card
        class="pa-10 mt-6 elevation-4 rounded-xl text-center"
        max-width="800"
      >
        <h1 class="text-h3 font-weight-bold primary--text mb-4">
          {{ t("message.home") }}
        </h1>

        <div v-if="authStore.isAuthenticated">
          <v-icon size="100" color="primary" class="mb-4"
            >mdi-account-circle</v-icon
          >
          <h2 class="text-h4 mb-2">
            {{
              t("message.welcomeUser", { username: authStore.user?.username })
            }}
          </h2>
          <p class="text-subtitle-1 text-grey-darken-1 mb-6">
            {{ t("message.roleMessage") }}
            <strong>{{ authStore.user?.role }}</strong>
          </p>

          <v-btn
            color="primary"
            variant="tonal"
            to="/admin/products"
            class="mx-2"
          >
            {{ t("message.viewProducts") }}
          </v-btn>
          <v-btn
            color="secondary"
            variant="tonal"
            to="/admin/categories"
            class="mx-2"
          >
            {{ t("message.viewCategories") }}
          </v-btn>
        </div>

        <div v-else>
          <v-icon size="100" color="grey" class="mb-4"
            >mdi-lock-open-outline</v-icon
          >
          <h2 class="text-h4 mb-4">{{ t("message.welcomeTitle") }}</h2>
          <p class="text-subtitle-1 mb-6">
            {{ t("message.loginPrompt") }}
          </p>
          <v-btn color="primary" size="large" to="/login">
            {{ t("message.login") }}
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
