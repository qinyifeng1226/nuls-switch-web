import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import {post} from './api/https'
import {post_swt} from './api/https'
import i18n from './i18n'

Vue.config.productionTip = false;
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$post_swt = post_swt;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
