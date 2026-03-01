<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import { useProductStore } from "../../../stores/product.store";
import { useCategoryStore } from "../../../stores/category.store";
import "@/plugins/chartConfig";

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const chartData = computed(() => {
  const labels = categoryStore.categories.map((c) => c.name);
  const data = categoryStore.categories.map((c) => {
    const catProducts = productStore.products.filter(
      (p) => p.categoryId === c.id,
    );
    if (catProducts.length === 0) return 0;
    const total = catProducts.reduce((acc: number, p: any) => acc + p.price, 0);
    return (total / catProducts.length).toFixed(2);
  });

  return {
    labels,
    datasets: [
      {
        label: "Precio Medio (€)",
        backgroundColor: "#43A047",
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
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <div style="height: 300px; width: 100%">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
