<template>
  <div>
    <!--div class="fixed-action-btn">
      <router-link v-if="isEmployee" to="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div-->
    <v-container>
      <v-layout row wrap>
        <v-flex xs4>
          <v-select
            :items="categories"
            box
            v-bind:label="$t('displayperpage')"
            v-model="currentCategory" 
            @change="categoryChanged"
          ></v-select>
        </v-flex>
        <v-flex xs4>
          <div style="{display: block}">
            <input v-model="txtSearch" class="kleiner" type="text" v-bind:placeholder="$t('search')" />
            <v-btn color="info" v-on:click="search">
              <v-icon>search</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs4>
          <v-select
            :items="sclItemsPerPage"
            box
            v-bind:label="$t('itemsperpage')"
            v-model="pageOne.itemsPerPage"
            @change="perPageChanged"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs8>
          <v-pagination
            v-model="pageOne.currentPage"
            :length="pageOne.totalPages"
            :total-visible="5"
            @input="pageOneChanged"
          ></v-pagination>
        </v-flex>
        <v-flex xs4>
          <v-btn-toggle>
            <v-btn flat @click='viewChange(true)'><v-icon>view_headline</v-icon></v-btn>
            <v-btn flat @click='viewChange(false)'><v-icon>view_module</v-icon></v-btn>
          </v-btn-toggle>
        </v-flex>
      </v-layout>
      <v-btn
            color="pink"
            dark
            fixed
            bottom
            right
            fab
            @click='addToProduct'
      >
        <v-icon>add</v-icon>
      </v-btn>
    <v-container v-if="listView">
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <template v-for="(item, index) in products">
              <v-list-tile
                :key="index"
                @click="editProduct(item.product_id)"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">touch_app</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ formatPrice(item.price) }} VND</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < products.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    </v-container>
    <v-container v-if="listView === false">
      <v-layout align-start justify-center row wrap v-for="i in Math.ceil(products.length / 3)" v-bind:key="i">
        <v-flex align-self-center xs-4 v-for="product in products.slice((i - 1) * 3, i * 3)" v-bind:key="product.id">
          <v-card tile elevation-8 fill-height>
              <v-img
                center
                max-width="250px"
                max-height="250px"
                v-bind:src="product.thumbUrl"
              ></v-img>
            <v-card-title primary-title>
              <v-container d-block>
                <small width="100%" class="text-muted" d-block><b>{{ product.name }}</b><br />{{ formatPrice(product.price) }} VND</small>
              </v-container>
            </v-card-title>
            <!--button @click='viewProduct(product.product_id)' class='button is-info'><i class="fa fa-eye"></i></button>
            <button v-if="isEmployee" @click='editProduct(product.product_id)' class='button is-info'><i class="fa fa-pencil"></i></button>
            <button @click='addToCart(product)' class='button is-info'><i class="fa fa-cart-arrow-down"></i></button-->
            <v-card-actions>
              <v-btn flat color="orange" @click='viewProduct(product.product_id)'><v-icon>zoom_in</v-icon></v-btn>
              <!--v-if="isEmployee"-->
              <v-btn flat color="orange" @click='editProduct(product.product_id)'><v-icon>build</v-icon></v-btn>
              <v-btn flat color="orange" @click='addToCart(product)'><v-icon>add_shopping_cart</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// storage reference:   gs://vnshoptest.appspot.com          
import firebaseApp from './firebaseInit'
import { mapActions } from 'vuex'
// import Pagination from './Pagination.vue'

export default {
  name: 'display',
 // components : { Pagination },
  data ( ) {
    return {
      listView: true,
      txtSearch: null,
      isLoggedIn: false,
      currentUser: false,
      isEmployee: false,
      currentCategory: 'All',
      categories: [],
      sclItemsPerPage: [
        10,
        50,
        100,
        1000
      ],
      productsAll: [],
      products: [],
      pageOne: {
        currentPage: 1,
        totalPages: 10,
        totalItems: null,
        itemsPerPage: 100
      }
    }
  },
  beforeMount ( ) {
    this.categories = process.env.VUE_APP_CATEGORIES.split(',')
    this.categories.unshift('All')
    var db = firebaseApp.firestore();
    if (firebaseApp.auth().currentUser) {
      this.isLoggedIn = true
      this.currentUser = firebaseApp.auth().currentUser.email
      db.collection('users').where('email', '==', this.currentUser).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var role = doc.data().role
          if (role === 'employee') {
            this.isEmployee = true
          }
        })
      })
    }
    if(this.$route.params.category_id == undefined) {
      this.singleSearch("1", "1", "1", "==", "1")
    }else{        
      this.currentCategory = this.categories[this.$route.params.category_id]
      this.singleSearch("category", this.currentCategory, "1", "==", "1")
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    formatPrice( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    search() {
      // clear products
      this.productsAll = []
      // normally all combined with category
      var oneleft = ""
      var oneright = ""
      if (this.currentCategory == "All") {
        oneleft = "1"
        oneright = "1"
      } else {
        oneleft = "category"
        oneright = this.currentCategory
      }
      if ((this.txtSearch == "") || (this.txtSearch == null) || (this.txtSearch == undefined)) {
        this.singleSearch(oneleft, oneright, "1", "==", "1")
      } else {
        this.singleSearch(oneleft, oneright, "barcode", "==", this.txtSearch)
        this.singleSearch(oneleft, oneright, "article_number", "==", this.txtSearch)
        this.singleSearch(oneleft, oneright, "name", "==", this.txtSearch)
       // this.singleSearch(oneleft, oneright, "tags", "array_contains", this.txtSearch)
      }               
    },
    singleSearch(oneleft, oneright, twoleft, twomiddle, tworight) {
      var db = firebaseApp.firestore()

      // 4008789-093905
     // db.collection('products').where(oneleft, "==", oneright).where(twoleft, twomiddle, tworight).get().then(querySnapshot => {
     var query = null
     if(oneleft == "1") {
       if(twoleft == "1") {
         query = db.collection('products')
       } else {
         query = db.collection('products').where(twoleft, twomiddle, tworight)
       }
     } else {
       if(twoleft == "1") {
         query = db.collection('products').where(oneleft, "==", oneright)
       } else {
         query = db.collection('products').where(oneleft, "==", oneright).where(twoleft, twomiddle, tworight)
       }
     }
     query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var thumbPicture = null
          if ((doc.data().thumbUrl == undefined) || (doc.data().thumbUrl == '')) {
            thumbPicture = "https://firebasestorage.googleapis.com/v0/b/vnshoptest.appspot.com/o/images%2Fno-image-icon-6.png?alt=media&token=4b4b8e91-6525-4607-b845-b2e8f0ce3b98"
          } else {
            thumbPicture = doc.data().thumbUrl
          }
          const data = {
            'product_id': doc.id,
            'article_number': doc.data().article_number,
            'barcode': doc.data().barcode,
            'category': doc.data().category,
            'colour': doc.data().colour,
            'description': doc.data().description,
            'name': doc.data().name,
            'name_ger': doc.data().name_ger,
            'price': doc.data().price,
            'size': doc.data().size,
            'thumbUrl': thumbPicture
          }
          this.productsAll.push(data)
        })
      this.resetPagination()
      }) 
    },
    resetPagination() {
      // for the pagination
      this.pageOne.currentPage = 1
      if (this.productsAll.length == 0) {
        this.pageOne.totalItems = 0
        this.pageOne.totalPages = 1
      } else {
        this.pageOne.totalItems = this.productsAll.length
        this.pageOne.totalPages = Math.ceil(this.pageOne.totalItems / this.pageOne.itemsPerPage)
      }
      var upperLimit = Math.min(this.pageOne.itemsPerPage, this.productsAll.length)
      this.products = this.productsAll.slice(0, upperLimit)
    },
    viewChange (listViewBool) {
      this.listView = listViewBool
    },
    pageOneChanged (pageNum) {
      this.pageOne.currentPage = pageNum
      this.products = this.productsAll.slice((pageNum - 1) * this.pageOne.itemsPerPage, this.pageOne.itemsPerPage * pageNum)
    },
    perPageChanged( ) {
      //this.pageOne.itemsPerPage = newnumber
      this.resetPagination()
    },
    categoryChanged( ) {
    //  console.log("category changed " + newcategory)
    //  this.currentCategory = newcategory
      this.search()
    },
    viewProduct(productId) {
      // /:product_id
      this.$router.push('/' + productId)
    },
    editProduct(productId) {
      // /edit/:product_id
      this.$router.push('/edit/' + productId)
    },
    addToProduct() {
      this.$router.push('/new')
    }
  }
}
</script>

<style>
input.kleiner {
  width: 80% !important;
}

img.surrounded {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>