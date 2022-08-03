import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import 'material-symbols'
import '@fortawesome/fontawesome-pro/js/all'
import './style/index.css'

import 'prismjs/components/prism-json.min'
import 'prismjs/components/prism-yaml.min'
import 'prismjs/components/prism-properties.min'
import 'prismjs/components/prism-c.min'
import 'prismjs/components/prism-glsl.min'

// import 'prism-themes/themes/prism-one-dark.min.css'
import 'prismjs/themes/prism-okaidia.min.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.config.globalProperties.$image = (url: string) =>
	new URL(`${url.replace('@/', '/assets/')}`, import.meta.url).href;

app.mount('#app')
