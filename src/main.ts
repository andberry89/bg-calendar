import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/main.css";

import VueTextareaAutosize from "vue-textarea-autosize";
import ClickOutside from "@/directives/click-outside";

const app = createApp(App);

app.use(createPinia());
app.use(VueTextareaAutosize);
app.directive("click-outside", ClickOutside);

app.mount("#app");