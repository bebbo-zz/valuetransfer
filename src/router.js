import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cashier from './components/Cashier.vue'
import Display from './components/Display.vue'
import EditProduct from './components/EditProduct.vue'
import ViewProduct from './components/ViewProduct.vue'
import ConfirmOrder from './components/ConfirmOrder.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Charts from './components/Charts.vue'
import Admin from './components/Admin.vue'
import SpecialOffers from './components/SpecialOffers.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/specialoffers',
      name: 'specialoffers',
      component: SpecialOffers
    },
    {
      path: '/categories/:category_id',
      name: 'categories',
      component: Display
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
      path: '/charts',
      name: 'charts',
      component: Charts
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
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
      path: '/order/:order_id/:token',
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
