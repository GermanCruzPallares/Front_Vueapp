<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCategoryStore, type Category } from "../../stores/category.store";
import CategoryCard from "../../components/CategoryCard.vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const categoryStore = useCategoryStore();
const dialog = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

// Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Mínimo 3 caracteres"),
  description: yup.string().required("La descripción es obligatoria"),
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
    success = await categoryStore.update(currentId.value, values);
  } else {
    success = await categoryStore.create(values);
  }

  if (success) {
    dialog.value = false;
    resetForm();
  }
});

const deleteCategory = async (id: number) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
    await categoryStore.remove(id);
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h4 font-weight-bold">Administración de Categorías</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openAdd">
        Nueva Categoría
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
      <CategoryCard :category="cat" @edit="openEdit" @delete="deleteCategory" />
    </v-col>

    <!-- Dialogo para Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-toolbar color="primary" dark density="comfortable">
          <v-toolbar-title>{{
            isEditing ? "Editar Categoría" : "Nueva Categoría"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="onSubmit">
            <v-text-field
              v-model="name"
              label="Nombre"
              variant="outlined"
              :error-messages="errors.name"
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Descripción"
              variant="outlined"
              :error-messages="errors.description"
              rows="3"
            ></v-textarea>

            <v-card-actions class="px-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
              <v-btn type="submit" color="primary" variant="elevated"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
