import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import './common/common.css'
import 'element-plus/dist/index.css'


import {router} from "@/route";
import {pinia} from "@/state";

const app = createApp(App)


app.use(router)

app.use(pinia)

app.use(ElementPlus)

app.mount('#app')
