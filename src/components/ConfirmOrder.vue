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
          <v-btn color="warning" @click="openreviewdialog(item.product_id)">{{$t('review')}}</v-btn>
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
        
        next(vm => {
            // check token
            if(pwd == doc.data().token) {
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
            }else{
              // route somewhere else
              this.$router.push('/')
            }
        })
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    })
  },
  methods: {
    openreviewdialog (product_id) {
      this.currentProduct = product_id
      this.reviewDialog = true
    },
    addReview () {
      var db = firebaseApp.firestore()

      var product_id = this.currentProduct
      var order_id = this.orderId
      // check if review for this order was made already
      var count = 0
      db.collection('reviews')
        .where('order_id', '==', order_id)
        .where('product_id', '==', product_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(
              count = count + 1
          )
      })
      if(count > 0) {
        alert("Review for this item already given")
      }else{
        // add new 
        var data = {
              'order_id': order_id,
              'product_id': product_id,
              'comment': this.currentComment,
              'rating': this.currentRating
            }
        db.collection('reviews').add(data)
          .then(this.reviewDialog = false)
      }
    },
    ordermore (product_id) {
      this.$router.push({name: 'view-product', params: {product_id: product_id}})
    }
  }
}
</script>