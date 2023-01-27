import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './assets/main.css';
import vClickOutside from './directives/v-click-outside';

const app = createApp(App)
  .use(i18n)
  .use(createPinia())
  .use(router);

app.directive('click-outside', vClickOutside);

app.mount('#app');
