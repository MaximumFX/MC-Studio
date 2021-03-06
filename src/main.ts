import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-pro/css/all.min.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import FormBuilder from '@/components/CustomTerrain/form/FormBuilder.vue'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)

app.component('FormBuilder', FormBuilder)

app.mount('#app')
