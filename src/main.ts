import { createApp } from "vue";
import App from "./App.vue";
import "./styles/main.css";

import VueTextareaAutosize from "vue-textarea-autosize";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import ClickOutside from "@/directives/click-outside";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv("VUE_APP_FIREBASE_API_KEY"),
  authDomain: requireEnv("VUE_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("VUE_APP_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("VUE_APP_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("VUE_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("VUE_APP_FIREBASE_APP_ID"),
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const db = firebase.firestore();

createApp(App).directive("click-outside", ClickOutside).use(VueTextareaAutosize).mount("#app");
