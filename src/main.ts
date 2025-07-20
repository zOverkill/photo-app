import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import App from './App.vue';
import router from './router';

/* Ionic Core & CSS Baselines */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/ionic.bundle.css';
import './theme/variables.css';

createApp(App)
    .use(IonicVue)
    .use(router)
    .mount('#app');