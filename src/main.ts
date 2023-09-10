import { createApp } from "vue";
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(uploader);
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
