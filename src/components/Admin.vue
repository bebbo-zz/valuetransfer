<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <h3>Admin</h3>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-divider></v-divider>
          <v-subheader>Product Batch Upload/Update</v-subheader>
          <v-btn @click="checkCorrectness" color="info">Start Upload</v-btn>
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
    <v-dialog 
        v-model="confirmDialog"
        persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Uploade Pre-check</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-treeview :items="upload_items"></v-treeview>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <v-btn @click.native="productUpload" color="info" large>Confirm</v-btn>
              </v-flex>
              <v-flex xs3 offset-xs1>
                <v-btn @click.native="closeDialog" color="error" large>Cancel</v-btn>                
              </v-flex>

            </v-layout>
          </v-container>        
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: 'admin',
  data () {
    return {
      txtProductUpload: null,
      productString: '',
      confirmDialog: false,
      upload_items: [],
      uploadMethod: null
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
      var flag_err = false
      var localBarcodes = {}
      var cloudBarcodes = {}
      var syntax_err = []
      var double_err = []
      var lines = this.productString.split('\n')
      lines.forEach(line => { 
        var curBarcode = line.substr(0, line.indexOf(';'))
        if(localBarcodes[curBarcode] != undefined) {
          double_err.push({'name':curBarcode})
          flag_err = true
        }
        localBarcodes[curBarcode] = 'insert'
        if((line.match(new RegExp("str", "g")) || []).length != 6) {
          syntax_err.push({'name':curBarcode})
          flag_err = true
        }
      })

      if(flag_err == false) {
        var barcodes_insert = []
        var barcodes_update = []

        var db = firebaseApp.firestore()
        db.collection('products').get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var strBarcode = doc.data().barcode
              cloudBarcodes[strBarcode] = '1'
            })
            localBarcodes.keys.forEach(barcode => {
              if(cloudBarcodes[barcode] != undefined) {
                barcodes_update.push({'name':barcode})
                localBarcodes[barcode] = 'update'
              }else{
                barcodes_insert.push({'name':barcode})
                localBarcodes[barcode] = 'insert'
              }
            })
            this.uploadMethod = localBarcodes
          })
      }else{
        if(syntax_err.length > 1) {
          const data = {
            'name': 'Wrong number of ;',
            'children': syntax_err
          }
          upload_items.push(data)
        }

        if(double_err.length > 1) {
          const data = {
            'name': 'Duplicated barcodes within upload',
            'children': double_err
          }
          upload_items.push(data)
        }
      }
      confirmDialog = true
    },
    closeDialog() {
      confirmDialog = false
    },
    productUpload() {
      console.log("start upload")
      var db = firebaseApp.firestore()

      var lines = this.productString.split('\n')
      lines.forEach(line => { 
        var attributes = this.line.split(';')
        if(this.uploadMethod[attributes[0]] = 'insert') {
          const data = {
            barcode: attributes[0],
            article_number: attributes[1],
            name: attributes[2],
            price: attributes[3],
            category: attributes[4],
            colour: attributes[5],
            size: attributes[6]
          }
          db.collection("products").add(data)
          .then(docRef => {
            console.log("product added " + docRef)
          })
          .catch(error => {
            console.log(error)
          })
        }else{
          db.collection("products").where('barcode', '==', attributes[0]).get()
            .then(docRef => {
              const data = {
                barcode: attributes[0],
                article_number: attributes[1],
                name: attributes[2],
                price: attributes[3],
                category: attributes[4],
                colour: attributes[5],
                size: attributes[6]
              }
              docRef.update(data)
            })
        }     
      })
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
