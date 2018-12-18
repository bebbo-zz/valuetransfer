import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import { i18n } from './plugins/i18n.js'
import { lodash } from './plugins/lodash.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  lodash,
  render: h => h(App)
}).$mount('#app')
