import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    added: [],
    totalSum: 0
  },
  mutations: {
    addToCart(state, product) {
      const record = state.added.find(p => p.product_id === product.product_id)
      
      if (!record) {
          state.added.push(product)
          if (product.quantity == 1) {
            Vue.set(product, 'totalPrice', product.price)
          }else{
            var tempNumber = Math.floor(product.quantity * product.price)
            Vue.set(product, 'totalPrice', tempNumber)
          }
      } else {
            var additionalQuantity = 1
            if (product.quantity == undefined) {
              additionalQuantity = 1
            } else {
              additionalQuantity = Math.floor(1 * product.quantity)
            }
            console.log("add" + additionalQuantity)
            record.quantity = Math.floor(record.quantity + additionalQuantity * 1)
            record.totalPrice = Math.floor(record.quantity * record.price)
      }
      var tmpSum = 0
      state.added.forEach(item => {
        console.log(item.totalPrice)
        tmpSum = Math.floor(tmpSum + item.totalPrice)
      })
      state.totalSum = Math.floor(tmpSum)
    },
    removeFromCart(state, item) {
      let index = state.added.indexOf(item);
  
      if (index > -1) {
        // let product = state.added[index];
        state.added.splice(index, 1);
      }
      var tmpSum = 0
      state.added.forEach(item => {
        tmpSum = tmpSum + item.totalPrice
      })
      state.totalSum = tmpSum
    }
  },
  actions: {
    addToCart({ commit }, product){ 
      commit('addToCart', product)
    },
    removeFromCart({commit}, item){
      commit('removeFromCart', item)
    },
    moveTotalSum({commit}, totalSumIn){
      commit('moveTotalSum', totalSumIn)
    }
  },
  getters: {
    getNumberOfProducts: state => (state.added) ? state.added.length : 0,
    cartProducts: (state) => {
      return state.added
    }, //state => state.added,
    getTotalSum: state => state.totalSum
  }
})
