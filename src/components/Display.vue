<template>
  <div>
    <div class="fixed-action-btn">
      <router-link v-if="isEmployee" to="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs4>
          <!--b-input-group prepend="Category">
            <b-dropdown v-bind:text="currentCategory">
              <b-dropdown-item @click="categroyChanged('All')">All</b-dropdown-item>
              <b-dropdown-item v-for="c in categories" v-bind:key="c" @click="categoryChanged(c)">{{c}}</b-dropdown-item>
            </b-dropdown>
          </b-input-group-->
          <v-select
            :items="categories"
            box
            label="Display per page"
            v-model="currentCategory" 
            @change="categoryChanged"
          ></v-select>
        </v-flex>
        <v-flex xs4>
          <div style="{display: block}">
            <input v-model="txtSearch" class="kleiner" type="text" placeholder="Search..." />
            <b-btn variant="info" v-on:click="search">
              <i class="fa fa-search"></i>
            </b-btn>
          </div>
        </v-flex>
        <v-flex xs4>
          <!--b-input-group prepend="Display per page">
            <b-dropdown v-bind:text="pageOne.itemsPerPage">
              <b-dropdown-item @click="perPageChanged(10)">10</b-dropdown-item>
              <b-dropdown-item @click="perPageChanged(50)">50</b-dropdown-item>
              <b-dropdown-item @click="perPageChanged(100)">100</b-dropdown-item>
              <b-dropdown-item @click="perPageChanged(1000)">1000</b-dropdown-item>
            </b-dropdown>
          </b-input-group-->
          <v-select
            :items="sclItemsPerPage"
            box
            label="Display per page"
            v-model="pageOne.itemsPerPage"
            @change="perPageChanged"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <pagination :current-page="pageOne.currentPage"
          :total-pages="pageOne.totalPages"
          @page-changed="pageOneChanged">
        </pagination>
      </v-layout>
    </v-container>
    <div class="row" v-for="i in Math.ceil(products.length / 3)" v-bind:key="i">
      <div v-for="product in products.slice((i - 1) * 3, i * 3)" v-bind:key="product.id" class="col-md-4 col-6 my-1">
        <v-card>
          <v-img
            v-bind:src="product.thumbUrl"
          ></v-img>
          <div slot="footer">
            <small class="text-muted">{{ product.name }}<br />{{ formatPrice(product.price) }} VND</small>   
          </div>
          <button @click='viewProduct(product.product_id)' class='button is-info'><i class="fa fa-eye"></i></button>
          <button v-if="isEmployee" @click='editProduct(product.product_id)' class='button is-info'><i class="fa fa-pencil"></i></button>
          <button @click='addToCart(product)' class='button is-info'><i class="fa fa-cart-arrow-down"></i></button>
          <!--v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions-->
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
// storage reference:   gs://vnshoptest.appspot.com          
import firebaseApp from './firebaseInit'
import { mapActions } from 'vuex'
import Pagination from './Pagination.vue'

export default {
  name: 'display',
  components : { Pagination },
  data ( ) {
    return {
      txtSearch: null,
      isLoggedIn: false,
      currentUser: false,
      isEmployee: false,
      currentCategory: 'All',
      categories: ["All", "Ăn dặm",
        "bách hoá",
        "Chăm sóc sức khoẻ cho trẻ em",
        "đồ chơi",
        "Đồ dùng gia đình",
        "Đồ dùng nhà bếp",
        "Làm đẹp- súc khoẻ",
        "Làm đẹp- sức khoẻ",
        "thời trang nam",
        "thời trang nữ",
        "thời trang trẻ em",
        "thời trang unisex",
        "Vệ sinh phụ nữ"],
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
    console.log("running through only once")
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
      db.collection('products').get().then(querySnapshot => {
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
              'thumbUrl': thumbPicture,
              'tags': null
          }
          this.productsAll.push(data)
        })
        console.log("mounted done " + this.productsAll.length)
        this.resetPagination()
      }) 
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    formatPrice( value ) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    search() {
      console.log("simple search");
      // clear products
      this.productsAll = []
      // normally all combined with category
      var oneleft = ""
      var oneright = ""
      var twoleft = "1"
      var twomiddle = "=="
      var tworight = "1"
      var columnBarcode = "barcode"
      var columnArticleNumber = "arctile_number"
      var columnName = "name"
      var columnThree = this.txtSearch
      if (this.currentCategory == "All") {
        oneleft = "1"
        oneright = "1"
      } else {
        oneleft = "category"
        oneright = this.currentCategory
      }
      if ((this.txtSearch == "") || (this.txtSearch == null) || (this.txtSearch == undefined)) {
        twoleft = "1"
        twomiddle = "=="
        tworight = "1"
        this.singleSearch(oneleft, oneright, "1", "==", "1")
      } else {
        this.singleSearch(oneleft, oneright, "barcode", "==", this.txtSearch)
        this.singleSearch(oneleft, oneright, "article_number", "==", this.txtSearch)
        this.singleSearch(oneleft, oneright, "name", "==", this.txtSearch)
       // this.singleSearch(oneleft, oneright, "tags", "array_contains", this.txtSearch)
      }               
    },
    singleSearch(oneleft, oneright, twoleft, twomiddle, tworight) {
      console.log("col1 " + oneleft + " col2 " + oneright)
      console.log("col3 " + twoleft + " col4 " + tworight)
      var db = firebaseApp.firestore();

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
          console.log("found data " + data)
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
    pageOneChanged (pageNum) {
      console.log("page changed, items per page: " + this.pageOne.itemsPerPage)
      this.pageOne.currentPage = pageNum
      this.products = this.productsAll.slice((pageNum - 1) * this.pageOne.itemsPerPage, this.pageOne.itemsPerPage * pageNum)
    },
    perPageChanged( ) {
      console.log("display" + newnumber)
      this.pageOne.itemsPerPage = newnumber
      this.resetPagination()
    },
    categoryChanged( ) {
      console.log("category changed " + newcategory)
      this.currentCategory = newcategory
      this.search()
    },
    viewProduct(productId) {
      // /:product_id
      this.$router.push('/' + productId)
    },
    editProduct(productId) {
      // /edit/:product_id
      this.$router.push('/edit/' + productId)
    }
  }
}
</script>

<style>
input.kleiner {
  width: 80% !important;
}
</style>