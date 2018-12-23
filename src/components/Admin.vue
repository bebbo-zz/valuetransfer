<template>
  <v-container>
    <v-layout row wrap>
      <h3>Admin</h3>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-divider></v-divider>
        <v-subheader>Product Batch Upload/Update</v-subheader>
        <v-btn @click="productUpload" color="info">Start Upload</v-btn>
        <v-btn @click="productRetrieve" color="info">Retrieve Data</v-btn>
        <br />
        {{$t('barcode')}};{{$t('articlenumber')}};{{$t('namedisplay')}};{{$t('price')}};{{$t('category')}};{{$t('colour')}};{{$t('size')}}
        <br />
        <v-textarea
          solo
          label="upload and update"
          v-model="productString"
        ></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-divider></v-divider>
        <v-subheader>Intake Batch Upload/Update</v-subheader>
        <v-btn @click="productUpload" color="info">Start Upload</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-divider></v-divider>
        <v-subheader>System Maintenance</v-subheader>
        <v-layout row wrap>
          <v-flex xs4>
            <v-btn @click="deleteAll" color="info">Reset DB</v-btn>
          </v-flex>
          <v-flex xs4>
            <v-btn @click="update" color="info">Update Frontend</v-btn>
          </v-flex>
          <v-flex xs4>
            <v-btn @click="update" color="info">Update Backend</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: 'admin',
  data () {
    return {
      txtProductUpload: null,
      productString: ''
    }
  },
  methods: {
    productRetrieve() {
      var db = firebaseApp.firestore()
      db.collection('products').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var strProduct = doc.data().barcode + ";"
          if(doc.data().article_number == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().article_number + ";")
          }
          if(doc.data().name == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().name + ";")
          }
          if(doc.data().price == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().price + ";")
          }
          if(doc.data().category == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().category + ";")
          }
          if(doc.data().colour == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().colour + ";")
          }
          if(doc.data().size == undefined) {
            strProduct = strProduct.concat(";")
          }else{
            strProduct = strProduct.concat(doc.data().size + ";")
          }
          this.productString = this.productString.concat(strProduct + "\n")
        })
      })
    },
    checkCorrectness() {
      console.log("check barcodes and semi-colons")
      var localBarcodes = []
      var errors = []
      var lines = this.productString.split('\n')
      lines.forEach(line => { 
        var curBarcode = line.substr(0, line.indexOf(';'))
        if((line.match(new RegExp("str", "g")) || []).length != 6) {
          "Wrong"
        }
      })
      
      //var db = firebaseApp.firestore()


    },
    productUpload() {
      console.log("start upload")
      var db = firebaseApp.firestore()
      this.products.forEach(item => {
        db.collection('products').add({
          barcode: item.barcode,
          name: item.name,
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
