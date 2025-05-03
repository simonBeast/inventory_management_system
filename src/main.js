import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router/index';
import "./assets/css/tailwind.css";
import App from './App.vue'


library.add(fas,far);



const pinia = createPinia();
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
