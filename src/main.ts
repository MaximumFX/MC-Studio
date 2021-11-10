import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-pro/css/all.min.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import FormBuilder from '@/components/CustomTerrain/form/FormBuilder.vue'

const app = createApp(App)
app.use(router)

app.component('FormBuilderG', FormBuilder)

app.mount('#app')