<template>
   <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs5>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="barcode"
              ref="barcode"
              label="Barcode"
              required
            ></v-text-field>
            <v-text-field
              v-model="quantity"
              label="Quantity"
              required
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              @click="submit"
            >
              Submit
            </v-btn>
            <v-btn @click="manualEntry">Manual Entry</v-btn>
          </v-form>
        </v-flex>
        <v-flex xs6 offset-xs1>
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
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="manual_quantity"
              label="Quantity"
              required
            ></v-text-field>
            <v-text-field
              v-model="manual_purchase_price"
              label="Purchase Price"
              required
            ></v-text-field>
             <v-text-field
              v-model="manual_name"
              label="Item Name"
              required
            ></v-text-field>
          </v-form>
          <v-btn @click.native="dialog = false">Cancel</v-btn>
          <v-btn @click.native="addItemManually">Add</v-btn>
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
      dialog: false,
      valid: true
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
      this.dialog = true
    },
    addItemManually () {
      this.dialog = false
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
    submit () {
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

          console.log("now back")
          // select and focus on barcode
          this.barcode = ''
          this.$refs.barcode.$el.focus()
          this.quantity = 1
        })
      })
    }
  }
}
</script>
