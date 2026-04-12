import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './styles/main.scss';
import VueTextareaAutosize from 'vue-textarea-autosize';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueTextareaAutosize);
app.mount('#app');
