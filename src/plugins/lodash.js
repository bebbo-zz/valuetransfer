import Vue from 'vue'
import VueLodash from 'vue-lodash'

Vue.use(VueLodash) // options is optional

export const lodash = new VueLodash({
  name: 'lodash'
})