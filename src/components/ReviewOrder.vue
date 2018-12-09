<template>
  <div id="review-order">
    <v-container>
      <v-layout row wrap>
        <h3>Thank you for your purchase...</h3>
      </v-layout>
      <v-layout row wrap>
        <h2>Order id: {{this.order_id}}</h2>
        <h2>Total sum: {{this.totalPrice}}</h2>
      </v-layout>
      <v-layout row wrap v-for="item in items" v-bind:key="item.product_id">
        <v-flex xs8>
          {{item.name}} <br />
          {{item.quantity}} X {{item.price}} = {{item.total}}
        </v-flex>
        <v-flex xs2>
          <v-btn color="warning" @click="sendreview(item.product_id)">Send Review</v-btn>
          <v-btn color="warning" @click="ordermore(item.product_id)">Order More</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog 
        v-model="reviewDialog"
        persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Review Product</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-rating
              v-model="currentRating"
              background-color="orange lighten-3"
              color="orange"
              x-large
            ></v-rating>
            <v-textarea
              name="input-7-1"
              label="Your comments"
              v-model="currentComment"
            ></v-textarea>
          </v-form>
          <v-btn @click.native="reviewDialog = false">Cancel</v-btn>
          <v-btn @click.native="addReview">Add Review</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
//import SHA256 from 'crypto-js/sha256'

export default {
  name: 'review-order',
  data () {
    return {
      totalPrice: null,
      order_id: null,
      reviewDialog: false,
      currentProduct: null,
      currentComment: null,
      items: [],
      currentRating: 3
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log("gets noch")
    var db = firebaseApp.firestore()
    var docRef = db.collection("orders").doc(to.params.order_id)
    console.log(to.params.order_id)
    docRef.get().then(function(doc) {
      if (doc.exists) {
        console.log("exists")
        // http://localhost:8080/#/order/47IELoFEJRgHyQ3bYY0P/
        // this.$route.query.pwd
        var pwd = to.query.pwd

        var orderid = to.params.order_id
        var internalpwd = '123'
        var price = Math.floor(doc.data().totalPrice)
        var forsha = orderid + internalpwd + price
        var compare = SHA256(forsha).toString()
        console.log(compare)

        if(pwd == compare) {
          next(vm => {
            vm.order_id = doc.id
            vm.totalPrice = doc.data().totalPrice
            var products = []
            doc.data().products.forEach(item => {
              const data = {
                  'barcode': item.barcode,
                  'name': item.name,
                  'quantity': item.quantity,
                  'price': item.price,
                  'total': item.total,
                  'product_id': item.product_id
                }
              products.push(item)
            })
            vm.items = products
          })
        }else{
          // route away
        } 
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    })
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      var db = firebaseApp.firestore();
      var docRef = db.collection("orders").doc(this.$route.params.order_id);
      docRef.get().then(function(doc) {
        if (doc.exists) {

          // http://localhost:8080/order/47IELoFEJRgHyQ3bYY0P?pwd=
          // this.$route.query.pwd
          var pwd = this.$route.query.pwd

          var orderid = this.$route.params.order_id
          var internalpwd = '123'
          var price = Math.floor(doc.data().totalPrice)
          var forsha = orderid + internalpwd + price
          var compare = SHA256(forsha).toString()
          console.log(compare)

          if(pwd == compare) {
              this.order_id = doc.id
              this.totalPrice = doc.data().totalPrice
              var products = []
              doc.data().products.forEach(item => {
                const data = {
                    'barcode': item.barcode,
                    'name': item.name,
                    'quantity': item.quantity,
                    'price': item.price,
                    'total': item.total,
                    'product_id': item.product_id
                  }
                products.push(item)
              })
              this.items = products
          }else{
            // route away
          } 
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      })
    },
    sendreview (product_id) {
      this.currentProduct = product_id
      this.reviewDialog = true
    },
    addReview () {
      //
    },
    ordermore (product_id) {
      this.$router.push({name: 'view-product', params: {product_id: product_id}})
    }
  }
}
