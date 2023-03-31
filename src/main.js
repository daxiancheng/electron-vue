import { createApp } from 'vue'
import App from './App.vue'
import localforage from "localforage";
window.localforage = localforage

createApp(App).mount('#app')
