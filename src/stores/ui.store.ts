import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const snackbar = ref({
    show: false,
    text: "",
    color: "success",
  });

  const theme = ref(localStorage.getItem("user-theme") || "light");

  function showSnackbar(text: string, color: string = "success") {
    snackbar.value = {
      show: true,
      text,
      color,
    };
  }

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    localStorage.setItem("user-theme", theme.value);
  }

  const dashboardFilters = ref({
    categoryId: null as number | null,
    startDate: null as string | null,
    endDate: null as string | null,
  });

  return { snackbar, showSnackbar, theme, toggleTheme, dashboardFilters };
});
