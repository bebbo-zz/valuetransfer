import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cashier from './components/Cashier.vue'
import Cart from './components/Cart.vue'
import Display from './components/Display.vue'
import NewProduct from './components/NewProduct.vue'
import EditProduct from './components/EditProduct.vue'
import ViewProduct from './components/ViewProduct.vue'
import ConfirmOrder from './components/ConfirmOrder.vue'
import Login from './components/Login.vue'
//import Register from './components/Register.vue'
import Charts from './components/Charts.vue'
import Admin from './components/Admin.vue'
import Receipt from './components/Receipt.vue'
import NewCost from './components/NewCost.vue'
import AccoutingEntries from './components/AccoutingEntries.vue'
import BusinessPartner from './components/BusinessPartner.vue'
import WriteInvoice from './components/WriteInvoice.vue'
import Stock from './components/Stock.vue'

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
      path: '/newcost',
      name: 'newcost',
      component: NewCost
    },
    {
      path: '/accoutingentries',
      name: 'accoutingentries',
      component: AccoutingEntries
    },
    {
      path: '/writeinvoice',
      name: 'writeinvoice',
      component: WriteInvoice
    },
    {
      path: '/businesspartner',
      name: 'businesspartner',
      component: BusinessPartner
    },
    {
      path: '/stock',
      name: 'stock',
      component: Stock
    },
 /*   {
      path: '/register',
      name: 'register',
      component: Register
    }, 
    {
      path: '/specialoffers',
      name: 'specialoffers',
      component: SpecialOffers
    },*/
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
      path: '/cart',
      name: 'cart',
      component: Cart
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
      path: '/new',
      name: 'new',
      component: NewProduct
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
      path: '/receipt/:order_id/:token',
      name: 'receipt',
      component: Receipt
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
