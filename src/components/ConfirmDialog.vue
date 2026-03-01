<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const handleCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
};

const handleConfirm = () => {
  emit("update:modelValue", false);
  emit("confirm");
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card class="rounded-xl pa-4">
      <v-card-title class="text-h6 font-weight-bold pt-4 px-4">
        {{ title }}
      </v-card-title>
      <v-card-text class="text-body-1 py-4 px-4">
        {{ message }}
      </v-card-text>
      <v-card-actions class="pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="handleCancel">
          {{ cancelText || t("message.cancel") }}
        </v-btn>
        <v-btn
          variant="elevated"
          :color="color || 'primary'"
          @click="handleConfirm"
        >
          {{ confirmText || t("message.delete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
