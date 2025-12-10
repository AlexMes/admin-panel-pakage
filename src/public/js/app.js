import './bootstrap';
import store from "./store.js";
import router from "./router.js";
import { createApp } from 'vue';
import VueCookies from 'vue-cookies';



import 'primeicons/primeicons.css'
import PrimeVue from "primevue/config"

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';


const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.800}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}',
        }

    }
});

const app = createApp({});

Object.entries(import.meta.glob('./**/*.vue', { eager: true })).forEach(([path, definition]) => {
    app.component(path.split('/').pop().replace(/\.\w+$/, ''), definition.default);
});

app.use(VueCookies, { expires: '15m' })
app.use(router)
app.use(store)
app.use(ConfirmationService)
app.use(DialogService)
app.use(ToastService)

app.use(PrimeVue, {
    theme: {
        preset: MyPreset
    }
});

app.mount('#app');
