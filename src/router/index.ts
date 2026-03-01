import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { layout: "MainLayout" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
      meta: { layout: "BlankLayout" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { layout: "MainLayout" },
    },
    {
      path: "/categories",
      name: "categories",
      component: () => import("../views/CategoriesView.vue"),
      meta: { layout: "MainLayout", requiresAuth: true },
    },
    {
      path: "/products",
      name: "products",
      component: () => import("../views/ProductsView.vue"),
      meta: { layout: "MainLayout", requiresAuth: true },
    },
    {
      path: "/products/:id",
      name: "product-detail",
      component: () => import("../views/ProductDetailView.vue"),
      meta: { layout: "MainLayout", requiresAuth: true },
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: () => import("../views/admin/DashboardView.vue"),
      meta: { layout: "AdminLayout", requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/categories",
      name: "admin-categories",
      component: () => import("../views/admin/CategoriesView.vue"),
      meta: { layout: "AdminLayout", requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/products",
      name: "admin-products",
      component: () => import("../views/admin/ProductsView.vue"),
      meta: { layout: "AdminLayout", requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/");
  } else if (to.name === "login" && authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
