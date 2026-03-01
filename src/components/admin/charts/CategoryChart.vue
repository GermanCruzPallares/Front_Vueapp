<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { useProductStore, type Product } from "../../../stores/product.store";
import { useCategoryStore } from "../../../stores/category.store";
import "@/plugins/chartConfig";

const categoryStore = useCategoryStore();

const props = defineProps<{
  products: Product[];
}>();

const chartData = computed(() => {
  const labels = categoryStore.categories.map((c) => c.name);
  const data = categoryStore.categories.map((c) => {
    return props.products.filter((p) => p.categoryId === c.id).length;
  });

  return {
    labels,
    datasets: [
      {
        backgroundColor: [
          "#1E88E5",
          "#43A047",
          "#FB8C00",
          "#E53935",
          "#8E24AA",
          "#00ACC1",
        ],
        data,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};
</script>

<template>
  <div style="height: 300px; width: 100%">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
