<template>
  <div id="confirm-order">
    <v-container>
      <v-layout row wrap>
        <v-flex xs8>
          <v-carousel
            height="400"
            max="400"
            cycle=false
          >
            <v-carousel-item
              v-for="(picture,i) in picturesRendered"
              :key="i"
              :src="picture.url"
            ></v-carousel-item>
          </v-carousel>
        </v-flex>
        <v-flex xs4>
          <ul style="list-style-type: none;">
            <li><h4>{{name}}</h4></li>
            <li>Price: {{ formatPrice(price) }} VND</li>
            <li>Barcode: {{barcode}}</li>
            <!--li>Article Number: {{article_number}}</li-->
            <!--li>Name (German): {{name_ger}}</li-->
            <li>Category: {{category}}</li>
          </ul>
          <v-btn
            color="pink"
            dark
            absolute
            bottom
            right
            fab
          >
            <v-icon>add_shopping_cart</v-icon>
          </v-btn>
        </v-flex>
      </v-layout> 
      <v-layout row wrap>
        <v-flex xs12>
          <p>&nbsp;</p>
          <v-divider></v-divider>
          <v-subheader>Product Description</v-subheader>
          <p>{{description}}</p>
        </v-flex>
      </v-layout> 
      <v-layout row wrap>
        <v-flex xs12>
          <v-divider></v-divider>
          <v-subheader>Product Reviews</v-subheader>
          <p></p>
        </v-flex>
      </v-layout> 
    </v-container>

    <!--router-link to="/" class="btn grey"><i class="fa fa-ban"></i></router-link>
    <div class="fixed-action-btn">
      <router-link v-bind:to="{name: 'view-product', params: {product_id: product_id}}" class="btn-floating btn-large red">
        <i class="fa fa-cart-plus"></i>
      </router-link>
      <p>&nbsp;</p>
      <router-link v-bind:to="{name: 'edit-product', params: {product_id: product_id}}" class="btn-floating btn-large red">
        <i class="fa fa-pencil"></i>
      </router-link>
    </div-->
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: 'confirm-order',
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

    // 09H2BQPxACFfM2nqC8O7
    console.log("here gehts")
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