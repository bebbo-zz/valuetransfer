import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cashier from './components/Cashier.vue'
import Display from './components/Display.vue'
import EditProduct from './components/EditProduct.vue'
import ViewProduct from './components/ViewProduct.vue'
import ReviewOrder from './components/ReviewOrder.vue'
import ConfirmOrder from './components/ConfirmOrder.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cashier',
      name: 'cashier',
      component: Cashier
    },
    {
      path: '/display',
      name: 'display',
      component: Display
    },
    {
      path: '/edit/:product_id',
      name: 'edit-product',
      component: EditProduct,
    },
    {
      path: '/:product_id',
      name: 'view-product',
      component: ViewProduct
    },
    {
      path: '/order/:order_id',
      name: 'review-order',
      component: ReviewOrder
    },
    {
      path: '/orders/:product_id',
      name: 'confirm-order',
      component: ConfirmOrder
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
