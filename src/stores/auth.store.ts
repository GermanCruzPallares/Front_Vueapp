import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<{ username: string; role: string } | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "Admin");

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  function setUser(newUser: { username: string; role: string }) {
    user.value = newUser;
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function loadUserFromStorage() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setToken,
    setUser,
    logout,
    loadUserFromStorage,
  };
});
