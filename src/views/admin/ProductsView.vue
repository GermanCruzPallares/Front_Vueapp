<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductStore, type Product } from "../../stores/product.store";
import { useCategoryStore } from "../../stores/category.store";
import ProductCard from "../../components/ProductCard.vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const dialog = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

// Validation Schema
const schema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  price: yup
    .number()
    .required("El precio es obligatorio")
    .positive("Debe ser mayor a 0"),
  categoryId: yup.number().required("La categoría es obligatoria"),
  description: yup.string().required("La descripción es obligatoria"),
  brand: yup.string().nullable(),
  size: yup.string().nullable(),
  color: yup.string().nullable(),
});

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
});

const { value: name } = useField<string>("name");
const { value: price } = useField<number>("price");
const { value: categoryId } = useField<number>("categoryId");
const { value: description } = useField<string>("description");
const { value: brand } = useField<string>("brand");
const { value: size } = useField<string>("size");
const { value: color } = useField<string>("color");

onMounted(async () => {
  await categoryStore.fetchAll();
  await productStore.fetchAll();
});

const openAdd = () => {
  isEditing.value = false;
  currentId.value = null;
  resetForm();
  dialog.value = true;
};

const openEdit = (product: Product) => {
  isEditing.value = true;
  currentId.value = product.id;
  name.value = product.name;
  price.value = product.price;
  categoryId.value = product.categoryId;
  description.value = product.description;
  brand.value = product.brand || "";
  size.value = product.size || "";
  color.value = product.color || "";
  dialog.value = true;
};

const onSubmit = handleSubmit(async (values) => {
  let success = false;
  if (isEditing.value && currentId.value) {
    success = await productStore.update(currentId.value, values as any);
  } else {
    success = await productStore.create(values as any);
  }

  if (success) {
    dialog.value = false;
    resetForm();
  }
});

const deleteProduct = async (id: number) => {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    await productStore.remove(id);
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h4 font-weight-bold">
        Gestión de Inventario (Productos)
      </h2>
      <v-btn
        color="primary"
        size="large"
        rounded="pill"
        prepend-icon="mdi-plus"
        @click="openAdd"
      >
        Nuevo Producto
      </v-btn>
    </v-col>

    <v-col v-if="productStore.loading" cols="12" class="text-center pa-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-col>

    <v-col
      v-else
      v-for="prod in productStore.products"
      :key="prod.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <ProductCard :product="prod" @edit="openEdit" @delete="deleteProduct" />
    </v-col>

    <!-- Dialogo para Crear/Editar -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-toolbar color="secondary" dark>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEditing ? "Actualizar Producto" : "Añadir Producto"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="onSubmit">
            <v-row>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="name"
                  label="Nombre del calzado"
                  variant="outlined"
                  :error-messages="errors.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="price"
                  label="Precio (€)"
                  type="number"
                  variant="outlined"
                  :error-messages="errors.price"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="categoryId"
                  :items="categoryStore.categories"
                  item-title="name"
                  item-value="id"
                  label="Categoría"
                  variant="outlined"
                  :error-messages="errors.categoryId"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="brand"
                  label="Marca"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="size"
                  label="Talla"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="color"
                  label="Color"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Descripción del producto"
                  variant="outlined"
                  :error-messages="errors.description"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-card-actions class="px-0 pt-2">
              <v-spacer></v-spacer>
              <v-btn
                variant="text"
                color="grey-darken-1"
                @click="dialog = false"
                >Cancelar</v-btn
              >
              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                class="px-6"
              >
                {{ isEditing ? "Actualizar" : "Guardar" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
