<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore, type Product } from "../../stores/product.store";
import { useCategoryStore } from "../../stores/category.store";
import ProductCard from "../../components/ProductCard.vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { useUiStore } from "../../stores/ui.store";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const productStore = useProductStore();
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
  name: yup.string().required(t("message.usernameRequired")),
  price: yup.number().required(t("message.price")).positive(" > 0"),
  categoryId: yup.number().required(t("message.category")),
  description: yup.string().required(t("message.description")),
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

const deleteProduct = (id: number) => {
  idToDelete.value = id;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (idToDelete.value) {
    const success = await productStore.remove(idToDelete.value);
    if (success) {
      uiStore.showSnackbar(t("message.deletedProd"));
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h4 font-weight-bold">
        {{ t("message.productAdmin") }}
      </h2>
      <v-btn
        color="primary"
        size="large"
        rounded="pill"
        prepend-icon="mdi-plus"
        @click="openAdd"
      >
        {{ t("message.newProduct") }}
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
            isEditing ? t("message.updateProduct") : t("message.addProduct")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="onSubmit">
            <v-row>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="name"
                  :label="t('message.name')"
                  variant="outlined"
                  :error-messages="errors.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="price"
                  :label="t('message.price') + ' (€)'"
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
                  :label="t('message.category')"
                  variant="outlined"
                  :error-messages="errors.categoryId"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="brand"
                  :label="t('message.brand')"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="size"
                  :label="t('message.size')"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="color"
                  :label="t('message.color')"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  :label="t('message.description')"
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
                >{{ t("message.cancel") }}</v-btn
              >
              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                class="px-6"
              >
                {{ isEditing ? t("message.update") : t("message.save") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      v-model="showDeleteDialog"
      :title="t('message.delete')"
      :message="t('message.confirmDeleteProd')"
      color="error"
      @confirm="confirmDelete"
    />
  </v-row>
</template>
