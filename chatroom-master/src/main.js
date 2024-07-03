import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index'
import "./mock/index.js"
import store from '@/store';


Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.use(ElementUI);


console.log(`Vue version: ${Vue.version}`);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
