import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/main.scss";
import VueTextareaAutosize from "vue-textarea-autosize";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ClickOutside from "@/directives/click-outside";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

const app = createApp(App);
const pinia = createPinia();

app.directive("click-outside", ClickOutside);
app.use(pinia);
app.use(VueTextareaAutosize);
app.mount("#app");
