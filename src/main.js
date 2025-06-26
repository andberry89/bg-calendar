import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
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

createApp(App).directive("click-outside", ClickOutside).use(VueTextareaAutosize).mount("#app");
