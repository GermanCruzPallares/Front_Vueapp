<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

// Validation Schema
const schema = yup.object({
  username: yup.string().required(t("message.usernameRequired")),
  password: yup
    .string()
    .required(t("message.passwordRequired"))
    .min(4, t("message.passwordTooShort")),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: username } = useField<string>("username");
const { value: password } = useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:8080/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(t("message.loginFailed"));
    }

    const data = await response.json();
    authStore.setToken(data.token);

    authStore.setUser({
      username: values.username,
      role: values.username === "admin" ? "Admin" : "User",
    });

    router.push("/");
  } catch (error: any) {
    errorMessage.value = error.message || t("message.unexpectedError");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="6" lg="5">
        <v-card class="elevation-12 rounded-lg pa-4" max-width="500">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center w-100 font-weight-bold">
              {{ $t("message.login") }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-8">
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="username"
                :label="$t('message.username')"
                name="username"
                prepend-inner-icon="mdi-account"
                type="text"
                variant="outlined"
                :error-messages="errors.username"
                color="primary"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :label="$t('message.password')"
                name="password"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :error-messages="errors.password"
                color="primary"
                class="mb-2"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="mt-4 font-weight-bold"
                elevation="2"
              >
                {{ $t("message.login") }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>
