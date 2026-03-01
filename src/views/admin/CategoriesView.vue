<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useCategoryStore, type Category } from "../../stores/category.store";
import CategoryCard from "../../components/CategoryCard.vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { useUiStore } from "../../stores/ui.store";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const categoryStore = useCategoryStore();
const uiStore = useUiStore();
const { t } = useI18n();
const dialog = ref(false);
const showDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

// Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required(t("message.usernameRequired")) // Reusing usernameRequired as nameRequired or similar
    .min(3, t("message.passwordTooShort")), // Reusing similar keys
  description: yup.string().required(t("message.description")),
});

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
});

const { value: name } = useField<string>("name");
const { value: description } = useField<string>("description");

onMounted(() => {
  categoryStore.fetchAll();
});

const openAdd = () => {
  isEditing.value = false;
  currentId.value = null;
  resetForm();
  dialog.value = true;
};

const openEdit = (category: Category) => {
  isEditing.value = true;
  currentId.value = category.id;
  name.value = category.name;
  description.value = category.description;
  dialog.value = true;
};

const onSubmit = handleSubmit(async (values) => {
  let success = false;
  if (isEditing.value && currentId.value) {
    success = await categoryStore.update(currentId.value, values as any);
  } else {
    success = await categoryStore.create(values as any);
  }

  if (success) {
    dialog.value = false;
    resetForm();
  }
});

const deleteCategory = (id: number) => {
  idToDelete.value = id;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (idToDelete.value) {
    const success = await categoryStore.remove(idToDelete.value);
    if (success) {
      uiStore.showSnackbar(t("message.deletedCat"));
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h4 font-weight-bold">{{ t("message.categoryAdmin") }}</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openAdd">
        {{ t("message.newCategory") }}
      </v-btn>
    </v-col>

    <v-col v-if="categoryStore.loading" cols="12" class="text-center pa-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-col>

    <v-col
      v-else
      v-for="cat in categoryStore.categories"
      :key="cat.id"
      cols="12"
      sm="6"
      md="4"
    >
      <CategoryCard
        :category="cat"
        show-actions
        @edit="openEdit"
        @delete="deleteCategory"
      />
    </v-col>

    <!-- Dialogo para Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-toolbar color="grey-lighten-4" border density="comfortable">
          <v-toolbar-title>{{
            isEditing ? t("message.editCategory") : t("message.newCategory")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="onSubmit">
            <v-text-field
              v-model="name"
              :label="t('message.name')"
              variant="outlined"
              :error-messages="errors.name"
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="description"
              :label="t('message.description')"
              variant="outlined"
              :error-messages="errors.description"
              rows="3"
            ></v-textarea>

            <v-card-actions class="px-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="dialog = false">{{
                t("message.cancel")
              }}</v-btn>
              <v-btn type="submit" color="primary" variant="elevated">{{
                t("message.save")
              }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      v-model="showDeleteDialog"
      :title="t('message.delete')"
      :message="t('message.confirmDeleteCat')"
      color="error"
      @confirm="confirmDelete"
    />
  </v-row>
</template>
