<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { locale } = useI18n();

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zhTW", name: "Taiwanese", flag: "🇹🇼" },
];

const currentLanguage = computed(() => {
  return languages.find((l) => l.code === locale.value) || languages[0];
});

const changeLanguage = (code: string) => {
  locale.value = code;
  localStorage.setItem("user-locale", code); // Persist preference
};
</script>

<template>
  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn
        color="transparent"
        v-bind="props"
        class="text-none px-2"
        rounded="pill"
        variant="flat"
      >
        <span class="text-h6 mr-1">{{ currentLanguage?.flag }}</span>
        <span class="hidden-sm-and-down">{{ currentLanguage?.name }}</span>
        <v-icon end size="small">mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list density="compact" class="mt-2 rounded-lg">
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        :active="locale === lang.code"
        color="primary"
        class="py-2"
      >
        <template v-slot:prepend>
          <span class="mr-3 text-h6">{{ lang.flag }}</span>
        </template>
        <v-list-item-title class="font-weight-medium">{{
          lang.name
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
