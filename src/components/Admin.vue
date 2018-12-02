<template>
  <v-container>
      <v-layout row wrap>
        <button v-on:click="productUpload" type="button" class="btn">Start Upload</button>
        <button v-on:click="deleteAll" type="button" class="btn">Delete Barcodes</button>
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
        // { name_ger: 'Garnier body intensive, peach', name: 'Sữa dưỡng thể Garnier chiết xuất đào', size: '250ml', colour: '', category: 'Làm đẹp- sức khoẻ', price: 135000, barcode: '3600542098182', article_number: '', description: '' }, 
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
          // console.log("product added")
        })
        .catch(error => {
          console.log(err)
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
