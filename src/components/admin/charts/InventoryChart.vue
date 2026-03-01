<script setup lang="ts">
import { computed } from "vue";
import { PolarArea } from "vue-chartjs";
import { useProductStore, type Product } from "../../../stores/product.store";
import "@/plugins/chartConfig";

const props = defineProps<{
  products: Product[];
}>();

const chartData = computed(() => {
  const brands = [...new Set(props.products.map((p) => p.brand || "Genérico"))];
  const data = brands.map((b) => {
    return props.products.filter((p) => (p.brand || "Genérico") === b).length;
  });

  return {
    labels: brands,
    datasets: [
      {
        backgroundColor: [
          "rgba(30, 136, 229, 0.5)",
          "rgba(67, 160, 71, 0.5)",
          "rgba(251, 140, 0, 0.5)",
          "rgba(229, 57, 53, 0.5)",
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
      position: "right" as const,
    },
  },
};
</script>

<template>
  <div style="height: 300px; width: 100%">
    <PolarArea :data="chartData" :options="chartOptions" />
  </div>
</template>
