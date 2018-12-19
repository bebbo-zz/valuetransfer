<template>
  <v-container>
      <v-layout row wrap>
        <v-btn @click="productUpload" color="info">Start Upload</v-btn>
        <v-btn @click="deleteAll" color="info">Reset DB</v-btn>
        <v-btn @click="update" color="info">Update Frontend</v-btn>
        <v-btn @click="update" color="info">Update Backend</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: 'admin',
  data () {
    return {
      products: [

]
    }
  },
  methods: {
    productUpload() {
      console.log("start upload")
      var db = firebaseApp.firestore();
      this.products.forEach(item => {
        db.collection('products').add({
          barcode: item.barcode,
          name: item.name,
          name_ger: item.name_ger,
          price: item.price,
          size: item.size,
          colour: item.colour,
          category: item.category,
          article_number: item.article_number,
          description: ''
        })
        .then(docRef => {
           console.log("product added " + docRef)
        })
        .catch(error => {
          console.log(error)
        })
      });
      console.log("finished upload")
    },
    deleteProducts() {
      var db = firebaseApp.firestore();
      this.products.forEach(item => {
        db.collection("products").where('barcode', '==', item.barcode).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => { doc.delete();})
        })
      });
    },
    update() {
      //
    },
    deleteAll() {
      console.log("delete started")
      var db = firebaseApp.firestore();
      db.collection("products").where('barcode', '>', '123123').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => { doc.ref.delete();})
        })
      db.collection("products").where('barcode', '<', '123123').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => { doc.ref.delete();})
        })
      console.log("delete finished")
    }
  }
}
</script>
