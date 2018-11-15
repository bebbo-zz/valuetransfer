<template>
   <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs6>
          <div class="row">
            <form @submit.prevent="enterProduct" class="col s12">
              <div class="row">
                <div class="input-field col s12">
                  <label>Barcode</label>
                  <br />
                  <input type="text" v-model="barcode" required>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <label>Quantity</label>
                  <br />
                  <input type="text" v-model="quantity" required>
                </div>
              </div>
              <button type="submit" class="btn">Add to Cart</button>
              <button type="button" class="btn" @click="manualEntry">Manual Entry</button>
            </form>
          </div>
        </v-flex>
        <v-flex xs6>
          <Cart />
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Modal Component -->
    <v-dialog 
        v-model="dialog"
        persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Manual Entry</span>
        </v-card-title>
        <v-card-text>
          <div class="row">
              <div class="input-field col s6">
                <label>Quantity</label>
                <br />
                <input type="text" v-model="manual_quantity" required>
              </div>
              <div class="input-field col s6">
                <label>Purchase Price</label>
                <br />
                <input type="text" v-model="manual_purchase_price" required>
              </div>
          </div>
          <div class="row">
              <div class="input-field col s12">
                <label>Item Name</label>
                <br />
                <input type="text" v-model="manual_name">
              </div>
          </div>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Add</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cart from '@/components/Cart'
import firebaseApp from './firebaseInit'
import { mapActions } from 'vuex'

// sample barcode 123123
export default {
  name: 'cashier',
  data () {
    return {
      product_id: null,
      barcode: null,
      category: null,
      price: null,
      name: null,
      quantity: 1,
      manual_quantity: null,
      manual_purchase_price: null,
      manual_name: null,
      manual_counter: 0,
      dialog: false
    }
  },
  components: {
      Cart
  },
  methods: {
    ...mapActions(['addToCart']),
    manualEntry() {
      this.manual_quantity = 1
      this.manual_purchase_price = 0
      this.manual_name = 'extra item'
      this.$refs.modalManuel.show()
    },
    addItemManually() {
      this.manual_counter = this.manual_counter + 1
      var data = {
        'product_id': this.manual_counter,
        'price': this.manual_purchase_price,
        'quantity': this.manual_quantity,
        'barcode': this.manual_counter,
        'name': this.manual_name,
        'category': 'manually added'
      }
      this.addToCart(data)
    },
    enterProduct() {
      var db = firebaseApp.firestore();
      db.collection('products').where('barcode', '==', this.barcode).get()
           .then(querySnapshot => {
             querySnapshot.forEach(doc => {
               var data = {
                   'product_id': doc.id,
                   'price': doc.data().price,
                   'quantity': this.quantity,
                   'barcode': doc.data().barcode,
                   'name': doc.data().name,
                   'category': doc.data().category
          }
          this.addToCart(data)
        })
      })
    }
  }
}
</script>
