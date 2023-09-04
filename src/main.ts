import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth === false) {
    if (localStorage.getItem("token")) {
      next("/home");
    } else {
      next();
    }
  } else {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next("/auth");
    }
  }
});
