import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const snackbar = ref({
    show: false,
    text: "",
    color: "success",
  });

  function showSnackbar(text: string, color: string = "success") {
    snackbar.value = {
      show: true,
      text,
      color,
    };
  }

  return { snackbar, showSnackbar };
});
