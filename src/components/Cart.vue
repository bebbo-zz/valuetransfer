<template>
  <div class="cart" style="margin-top: 15px;">
    <h1 class="title">{{$t('yourcart')}}</h1>
    <p v-show="!products.length">
      <i>{{$t('yourcartisempty')}}</i>
    </p>
    <v-data-table 
      :headers="headers"
      :items="products"
      class="elevation-1"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.quantity }}</td>
        <td>{{ formatPrice(props.item.price) }} {{$t('vnd')}}</td>
        <td><v-btn @click="removeFromCart(props.item)"><v-icon>delete</v-icon></v-btn></td>
      </template>
    </v-data-table>
    <v-container>
      <v-layout row wrap>
        <v-flex xs6>
          <b>{{$t('total')}}:</b>
        </v-flex>
        <v-flex xs6>
          <b>{{ formatPrice(total) }} {{$t('vnd')}}</b>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' },
        { text: 'Remove', value: 'remove' }
      ],
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
    ...mapActions(['removeFromCart']),
    getTotalSum () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    },
    formatPrice ( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
}
</script>