import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import VueTextareaAutosize from "vue-textarea-autosize";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCxs88m_I6zgEhBQteOjZpT4ViSAAQbH5k",
  authDomain: "bg-calendar-6f750.firebaseapp.com",
  projectId: "bg-calendar-6f750",
  storageBucket: "bg-calendar-6f750.firebasestorage.app",
  messagingSenderId: "661066526224",
  appId: "1:661066526224:web:8d857fc1de1cde3e982495",
});

export const db = firebase.firestore();

createApp(App).use(VueTextareaAutosize).mount("#app");
