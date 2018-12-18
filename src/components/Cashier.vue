<template>
   <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs5>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="barcode"
              ref="barcode"
              v-bind:label="$t('barcode')"
              large
              required
            ></v-text-field>
            <v-text-field
              v-model="quantity"
              v-bind:label="$t('quantity')"
              large
              required
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              @click="submit"
              large
            >
              {{$t('submit')}}
            </v-btn>
            <v-btn @click="manualEntry" large>{{$t('manualentry')}}</v-btn>
          </v-form>
          <p><v-btn @click='checkout' color="success">{{$t('cashpayment')}}</v-btn></p>
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
          <span class="headline">{{$t('manualentry')}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="manual_quantity"
              v-bind:label="$t('quantity')"
              required
            ></v-text-field>
            <v-text-field
              v-model="manual_purchase_price"
              v-bind:label="$t('purchaseprice')"
              required
            ></v-text-field>
             <v-text-field
              v-model="manual_name"
              v-bind:label="$t('itemname')"
              required
            ></v-text-field>
          </v-form>
          <v-btn @click.native="dialog = false">{{$t('cancel')}}</v-btn>
          <v-btn @click.native="addItemManually">{{$t('add')}}</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Modal Payment -->
    <v-dialog 
        v-model="modalPayment"
        persistent max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('payment')}}</span>
        </v-card-title>
        <v-card-text>
          <!-- grid with a lot of buttons -->

          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field placeholder="0" solo prefix="VND" v-model="paidDisplay" disabled></v-text-field>
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
               <v-btn @click.native="clear" color="error" large>{{$t('clear')}}</v-btn>
              </v-flex>
              <v-flex xs2>
               <p>&nbsp;</p>
              </v-flex>
              <v-flex xs2>
                <v-btn @click.native="closeDialog" color="error" large>{{$t('cancel')}}</v-btn>                
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-btn @click.native="finishPayment" color="success" large>{{$t('printreceipt')}}</v-btn>
              </v-flex>
            </v-layout>
          </v-container>        
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Modal Return -->
    <v-dialog 
        v-model="modalReturn"
        persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('givechange')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <p>{{$t('pleasereturn')}} {{formatPrice(changeToGive)}} {{$t('vnd')}}</p>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <v-btn @click.native="closeDialog" color="info" large>{{$t('printadditionalreceipt')}}</v-btn>
              </v-flex>
              <v-flex xs3 offset-xs1>
                <v-btn @click.native="closeDialog" color="error" large>{{$t('cancel')}}</v-btn>                
              </v-flex>
              <v-flex xs3 offset-xs1>
                <v-btn @click.native="nextCustomer" color="success" large>{{$t('nextcustomer')}}</v-btn>                
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
import SHA256 from 'crypto-js/sha256'
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
      changeToGive: 0,
      receiptId: null
    }
  },
  components: {
      Cart
  },
  computed: {
    ...mapGetters({
      totalSum: 'getTotalSum',
      products: 'cartProducts'
    }),
  },
  updated: function() {
    console.log("updated " + this.$refs.barcode)
    this.$nextTick(() => this.$refs.barcode.focus())
  },
  methods: {
    ...mapActions(['addToCart']),
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
      this.changeToGive = Math.floor(this.moneyPaid - this.totalSum)
      if(this.changeToGive < 0) {
        alert("Not enough money paid")
      }else{
        this.modalPayment = false
        this.storeReceipt()
        //  this.sendPrintRequest()
        this.modalReturn = true
      }
    },
    getitems() {
      this.$store.getters.cartProducts
    },
    storeReceipt() {
      console.log("store receipt")
      var db = firebaseApp.firestore()
      var tmpProductArray = []
      this.products.forEach(prod => {
        var total = prod.quantity * prod.price
        var productMap = {
          'product_id': prod.product_id,
          'price': prod.price,
          'quantity': prod.quantity,
          'barcode': prod.barcode,
          'name': prod.name,
          'category': prod.category,
          'total': total
        }
        tmpProductArray.push(productMap)
      })
      // 4000991030777
      // 123123

      var salt = Math.floor(Math.random() * 1000) + 1 
      var internalpwd = '123'
      var price = Math.floor(this.totalSum)
      var forsha = salt + internalpwd + price
      var token = SHA256(forsha).toString()

      console.log(this.totalSum)
      var docData = {
        totalPrice: this.totalSum,
        receiptDate: new Date(),
        token: token,
        products: tmpProductArray
      }
      var vm = this
      db.collection("orders").add(docData)
        .then(docRef => {
          var printData = {
            orderId: docRef.id,
            totalPrice: vm.totalSum,
            moneyPaid: vm.moneyPaid,
            moneyChange: vm.changeToGive,
            products: tmpProductArray,
            created: new Date(),
          }
        // here print request
        //  db.collection("prints").add(printData)
        //    .then(() => {console.log("print request sent")})
        const xhttp = new XMLHttpRequest()
        xhttp.open("POST", "/app/print", true)
        xhttp.setRequestHeader("Content-Type", "application/json")
        printData = JSON.stringify(printData)
       // console.log(printData)
        xhttp.send(printData) 
      })
    },
    formatPrice( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    manualEntry() {
      console.log("write " + this.$refs.barcode.$el.children[0].text)
      this.$nextTick(() => this.$refs.barcode.focus())
      
      this.manual_quantity = 1
      this.manual_purchase_price = 0
      this.manual_name = 'extra item'
   //   this.dialog = true
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
      this.setToStart()
    },
    submit () {
      var db = firebaseApp.firestore();
      db.collection('products').where('barcode', '==', this.barcode).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var data = {
              'product_id': doc.id,
              'price': doc.data().price,
              'quantity': Math.floor(this.quantity),
              'barcode': doc.data().barcode,
              'name': doc.data().name,
              'category': doc.data().category
          }
          this.addToCart(data)
          // select and focus on barcode
          this.setToStart()
        })
      })
    },
    nextCustomer() {
      this.product_id = null
      this.barcode = null
      this.ategory = null
      this.price = null
      this.name = null
      this.quantity = 1
      this.manual_quantity = null
      this.manual_purchase_price = null
      this.manual_name = null
      this.manual_counter = 0
      this.dialog = false
      this.modalPayment = false
      this.modalReturn = false
      this.valid = true
      this.moneyPaid = 0
      this.paidDisplay = null
      this.changeToGive = 0
      this.receiptId = null
      this.setToStart()
    },
    setToStart() {
      this.barcode = null
      this.quantity = 1
      this.$nextTick(() => this.$refs.barcode.focus())
    }
  }
}
</script>
