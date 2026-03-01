<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";
import type { Category } from "../stores/category.store";

defineProps<{
  category: Category;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: number): void;
}>();

const authStore = useAuthStore();
</script>

<template>
  <v-card class="mb-4 elevation-2 rounded-lg" border>
    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold primary--text">
        {{ category.name }}
      </v-card-title>
      <v-card-subtitle> ID: {{ category.id }} </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p class="text-body-1">{{ category.description }}</p>
    </v-card-text>

    <v-divider v-if="authStore.isAdmin"></v-divider>

    <v-card-actions v-if="authStore.isAdmin" class="pa-4">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        prepend-icon="mdi-pencil"
        @click="emit('edit', category)"
      >
        Editar
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        prepend-icon="mdi-delete"
        @click="emit('delete', category.id)"
      >
        Eliminar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
