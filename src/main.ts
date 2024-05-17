import { createApp } from "vue";
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'
import App from "./App.vue";
import router from "./router";
import axios from 'axios';

const app = createApp(App);
app.use(router);
app.use(uploader);
app.mount("#app");

axios.defaults.baseURL = 'http://localhost:8080/api/v1/';
app.provide('$axios',axios)