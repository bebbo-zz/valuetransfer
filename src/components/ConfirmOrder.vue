<template>
  <div id="confirm-order">
    <v-container>
      <v-layout row wrap>
        <h3>{{$t('thankyouforpurchase')}}</h3>
        <v-spacer></v-spacer>
      </v-layout>
    <v-layout row wrap>
        <h4>{{$t('order')}}: {{this.order_id}}</h4><br />
        <h4>{{$t('total')}}: {{this.totalPrice}}</h4>
        <v-spacer></v-spacer>
      </v-layout>
      <v-layout row wrap v-for="item in items" v-bind:key="item.product_id">
        <v-flex xs8>
          <v-divider></v-divider>
          {{item.name}} <br />
          {{item.quantity}} X {{item.price}} = {{item.total}}
        </v-flex>
        <v-flex xs2>
          <v-btn color="warning" @click="sendreview(item.product_id)">{{$t('review')}}</v-btn>
          <v-btn color="warning" @click="ordermore(item.product_id)">{{$t('ordermore')}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog 
        v-model="reviewDialog"
        persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('review')}}</span>
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
          <v-btn @click.native="reviewDialog = false">{{$t('cancel')}}</v-btn>
          <v-btn @click.native="addReview">{{$t('add')}}</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
import SHA256 from 'crypto-js/sha256'

export default {
  name: 'confirm-order',
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

    // product
    // 09H2BQPxACFfM2nqC8O7

    // order
    //47IELoFEJRgHyQ3bYY0P
    // 62c563a922085443392de39f26d6a71c08093012662e82b39121a4281608819c
    // http://localhost:8080/order/47IELoFEJRgHyQ3bYY0P?pwd=62c563a922085443392de39f26d6a71c08093012662e82b39121a4281608819c
    var db = firebaseApp.firestore()
    var docRef = db.collection("orders").doc(to.params.order_id);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        var pwd = to.params.token
        var orderid = to.params.order_id
        var internalpwd = '123'
        var price = Math.floor(doc.data().totalPrice)
        var forsha = orderid + internalpwd + price
        var compare = SHA256(forsha).toString()
        console.log(pwd)
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
              products.push(data)
            })
            vm.items = products
          })
        }else{
          // route somewhere else
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
    fetchData ( ) {
     //
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
</script>