<template>
  <div id="view-product">
    <v-container>
      <v-layout row wrap>
        <v-flex xs6>
          <v-carousel :perPage="1" width="400">
            <slide v-for="picture in picturesRendered" v-bind:key="picture.url"  width="400">
              <img v-bind:src="picture.url" v-bind:width="picture.width" v-bind:height="picture.height"/>
            </slide>
          </v-carousel>
        </v-flex>
        <v-flex>
          <ul style="list-style-type: none;">
            <li class="collection-header"><h4>{{name}}</h4></li>
            <li class="collection-item">Price: {{ formatPrice(price) }}</li>
            <li class="collection-item">Barcode: {{barcode}}</li>
            <li class="collection-item">Article Number: {{article_number}}</li>
            <li class="collection-item">Name (German): {{name_ger}}</li>
            <li class="collection-item">Category: {{category}}</li>
            <li class="collection-item">Description: <span v-for="line in description.split('\n')" v-bind:key="line">{{line}}<br /></span></li>
          </ul>
        </v-flex>
      </v-layout>    
    </v-container>
    <router-link to="/" class="btn grey"><i class="fa fa-ban"></i></router-link>
    <div class="fixed-action-btn">
      <router-link v-bind:to="{name: 'view-product', params: {product_id: product_id}}" class="btn-floating btn-large red">
        <i class="fa fa-cart-plus"></i>
      </router-link>
      <p>&nbsp;</p>
      <router-link v-bind:to="{name: 'edit-product', params: {product_id: product_id}}" class="btn-floating btn-large red">
        <i class="fa fa-pencil"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: 'view-product',
  data () {
    return {
      product_id: null,
      article_number: null,
      barcode: null,
      category: null,
      colour: null,
      description: null,
      name: null,
      name_ger: null,
      price: null,
      size: null,
      tags: null,
      pictures: [],
      picturesRendered: []
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore();
    var docRef = db.collection("products").doc(to.params.product_id);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        next(vm => {
            vm.product_id = doc.id
            vm.article_number = doc.data().article_number
            vm.barcode = doc.data().barcode
            vm.category = doc.data().category
            vm.colour = doc.data().colour
            vm.description = doc.data().description
            vm.name = doc.data().name
            vm.name_ger = doc.data().name_ger
            vm.price = doc.data().price
            vm.size = doc.data().size
            vm.pictures = doc.data().picsUrl
            var rendered = []
            doc.data().picsUrl.forEach(pic => {
              var img = new Image();
              img.onload = function( ) {
                var width = this.width
                var height = this.height
                var max_size = 300
                if (width > height) {
                  if (width > max_size) {
                      height *= max_size / width
                      width = max_size
                    }
                } else {
                  if (height > max_size) {
                        width *= max_size / height
                        height = max_size
                    }
                }
                const data = {
                  'url': pic,
                  'width': width,
                  'height': height,
                }
                rendered.push(data)
              }
              img.src = pic;
            })
            vm.picturesRendered = rendered
          })
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
    formatPrice( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    fetchData ( ) {
      var db = firebaseApp.firestore();
      console.log("fetchdata: " + this.$route.params.product_id)
      var docRef = db.collection("products").doc(this.$route.params.product_id);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          this.product_id = doc.id
          this.article_number = doc.data().article_number
          this.barcode = doc.data().barcode
          this.category = doc.data().category
          this.colour = doc.data().colour
          this.description = doc.data().description
          this.name = doc.data().name
          this.name_ger = doc.data().name_ger
          this.price = doc.data().price
          this.size = doc.data().size
          this.pictures = doc.data().picsUrl
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      })
    }
  }
}
</script>