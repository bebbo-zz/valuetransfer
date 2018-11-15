<template>
  <div class="cart">
    <h1 class="title">Your Cart</h1>
    <p v-show="!products.length">
    	<i>Your cart is empty!</i>
    	<router-link to="/">Go shopping</router-link>
    </p>
    <table class="table is-striped" v-show="products.length">
    	<thead>
    		<tr>
    			<td>Name</td>
    			<td>Price</td>
    			<td>Quantity</td>
    		</tr>
    	</thead>
    	<tbody>
    		<tr v-for="p in products" v-bind:key="p.product_id">
        		<td>{{ p.name }}</td>
        		<td>{{ p.price }} VND</td>
        		<td>{{ p.quantity }}</td>
            <td><button @click="removeFromCart(p)" class="btn" v-b-tooltip.hover title="Delete Entry"><i class="fa fa-trash"></i></button></td>
        	</tr>
        	<tr>
        		<td><b>Total:</b></td>
        		<td></td>
        		<td><b>{{ total }} VND</b></td>
        	</tr>
    	</tbody>
    </table>
    <p><button v-show="products.length" class='btn' @click='checkout'>Checkout</button></p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      totalSum: 0
    }
  },
  computed: {
    ...mapGetters({
      products: 'cartProducts'
    }),
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  methods: {
    ...mapActions(['removeFromCart', 'moveTotalSum']),
  	checkout() {
      this.totalSum = getTotalSum()
      moveTotalSum(this.totalSum)
    },
    getTotalSum() {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  }
}
</script>