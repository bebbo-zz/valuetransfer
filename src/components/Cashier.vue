<template>
   <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs5>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="barcode"
              ref="barcode"
              label="Barcode"
              large
              required
            ></v-text-field>
            <v-text-field
              v-model="quantity"
              label="Quantity"
              large
              required
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              @click="submit"
              large
            >
              Submit
            </v-btn>
            <v-btn @click="manualEntry" large>Manual Entry</v-btn>
          </v-form>
          <p><v-btn @click='checkout' color="success">Cash Payment</v-btn></p>
        </v-flex>
        <v-flex xs6 offset-xs1>
          <Cart />
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Modal Manual Entry -->
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
    <!-- Modal Payment -->
    <v-dialog 
        v-model="modalPayment"
        persistent max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">Payment</span>
        </v-card-title>
        <v-card-text>
          <!-- grid with a lot of buttons -->

          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field placeholder="0" solo prefix="VND" v-model="paidDisplay"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs2>
                <v-btn @click.native="typing(1)" color="info" large>1</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(2)" color="info" large>2</v-btn>                
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(3)" color="info" large>3</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-btn @click.native="quicktype(500000)" color="warning" large>500.000</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs2>
                <v-btn @click.native="typing(4)" color="info" large>4</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(5)" color="info" large>5</v-btn>                
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(6)" color="info" large>6</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-btn @click.native="quicktype(1000000)" color="warning" large>1.000.000</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs2>
                <v-btn @click.native="typing(7)" color="info" large>7</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(8)" color="info" large>8</v-btn>                
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(9)" color="info" large>9</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-btn @click.native="quicktype(2000000)" color="warning" large>2.000.000</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs2>
                <p>&nbsp;</p>                
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="typing(0)" color="info" large>0</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="multiply(1000)" color="info" large>'000</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
               <v-btn @click.native="exact" color="warning" large>Exact</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
               <p>&nbsp;</p>
              </v-flex>
            </v-layout>
             <v-layout row wrap>
              <v-flex xs2>
               <v-btn @click.native="clear" color="error" large>Clear</v-btn>
              </v-flex>
              <v-flex xs2>
               <p>&nbsp;</p>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="closeDialog" color="error" large>Cancel</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-btn @click.native="finishPayment" color="success" large>Print Receipt</v-btn>
              </v-flex>
            </v-layout>
          </v-container>        
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Modal Return -->
    <v-dialog 
        v-model="modalReturn"
        persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Give Change</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <p>Please return {{formatPrice(changeToGive)}} VND</p>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <v-btn @click.native="closeDialog" color="info" large>Print Additional Receipt</v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn @click.native="closeDialog" color="error" large>Cancel</v-btn>                
              </v-flex>
              <v-flex xs4>
                <v-btn @click.native="closeDialog" color="success" large>Next Customer</v-btn>                
              </v-flex>
            </v-layout>
          </v-container>        
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cart from '@/components/Cart'
import firebaseApp from './firebaseInit'
import { mapActions, mapGetters } from 'vuex'

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
      modalPayment: false,
      modalReturn: false,
      valid: true,
      moneyPaid: 0,
      paidDisplay: null,
      changeToGive: 0
    }
  },
  components: {
      Cart
  },
  methods: {
    ...mapActions(['addToCart']),
    ...mapGetters({
      totalSum: 'getTotalSum'
    }),
    checkout () {
      this.modalPayment = true
    },
    closeDialog() {
      this.modalPayment = false
      this.modalReturn = false
    },
    typing(numberToAdd) {
      this.moneyPaid = (this.moneyPaid * 10) + numberToAdd
      this.paidDisplay = this.formatPrice(this.moneyPaid)
    },
    quicktype(numberPaid) {
      this.moneyPaid = numberPaid
      this.paidDisplay = this.formatPrice(this.moneyPaid)
    },
    multiply() {
      this.moneyPaid = (this.moneyPaid * 1000)
      this.paidDisplay = this.formatPrice(this.moneyPaid)
    },
    clear() {
      this.moneyPaid = 0
      this.paidDisplay = this.formatPrice(this.moneyPaid)
    },
    exact() {
      this.moneyPaid = this.totalSum
      this.paidDisplay = this.formatPrice(this.moneyPaid)
    },
    finishPayment() {
      this.modalPayment = false
      this.changeToGive = this.totalSum - this.moneyPaid
      this.modalReturn = true
    },
    formatPrice( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
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
