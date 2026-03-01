import { createI18n } from "vue-i18n";

const messages = {
  en: {
    message: {
      hello: "hello world",
      login: "Login",
      logout: "Logout",
      categories: "Categories",
      products: "Products",
      admin: "Admin",
      home: "Home",
      username: "Username",
      password: "Password",
      usernameRequired: "Username is required",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 4 characters long",
      loginFailed: "Invalid username or password",
      unexpectedError: "An unexpected error occurred",
    },
  },
  es: {
    message: {
      hello: "hola mundo",
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión",
      categories: "Categorías",
      products: "Productos",
      admin: "Administración",
      home: "Inicio",
      username: "Usuario",
      password: "Contraseña",
      usernameRequired: "El usuario es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
      passwordTooShort: "La contraseña debe tener al menos 4 caracteres",
      loginFailed: "Usuario o contraseña incorrectos",
      unexpectedError: "Ha ocurrido un error inesperado",
    },
  },
};

export const i18n = createI18n({
  locale: "es", // set locale
  fallbackLocale: "en", // set fallback locale
  messages, // set locale messages
});
