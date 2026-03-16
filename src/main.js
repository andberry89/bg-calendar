import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/main.scss";
import VueTextareaAutosize from "vue-textarea-autosize";
import ClickOutside from "@/directives/click-outside";

const app = createApp(App);
const pinia = createPinia();

app.directive("click-outside", ClickOutside);
app.use(pinia);
app.use(VueTextareaAutosize);
app.mount("#app");
