<template>
  <div id="new">
    <v-form v-model="valid">
      <v-container>
        <v-layout row wrap>
          <h3>{{$t('newproduct')}}</h3>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('barcode')"
              v-model="barcode"
              :rules="barcodeRules"
              required
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('articlenumber')"
              v-model="article_number"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <!--v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-bind:label="$t('namegerman')"
              v-model="name_ger"
            >
            </v-text-field>
          </v-flex>
        </v-layout-->
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-bind:label="$t('namedisplay')"
              v-model="name"
              :rules="nameRules"
              required
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('price')"
              v-model="price"
              :rules="priceRules"
              required
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('category')"
              v-model="category"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('colour')"
              v-model="colour"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('size')"
              v-model="size"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-divider></v-divider>
            <v-tooltip top>
              <v-btn @click="saveProduct('close')" slot="activator"><v-icon>save</v-icon></v-btn>
              <span>{{$t('save')}}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn @click="saveProduct('edit')" slot="activator"><v-icon>forward</v-icon></v-btn>
              <span>{{$t('save')}} {{$t('and')}} {{$t('edit')}}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn @click="abort" slot="activator"><v-icon>highlight_off</v-icon></v-btn>
              <span>{{$t('cancel')}}</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-dialog 
        v-model="forwardDialog"
        persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Barcode is already Existing</span>
        </v-card-title>
        <v-card-text>
          <v-btn @click.native="editBarcode" color="success">{{$t('edit')}}</v-btn>
          <v-btn @click.native="forwardDialog = false" color="error">{{$t('cancel')}}</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import db from './firebaseInit'
import firebaseApp from "./firebaseInit";

export default {
  name: "new",
  data() {
    return {
      forwardDialog: false,
      curProductId: null,
      article_number: null,
      barcode: null,
      barcodeRules: [
        v => !!v || 'Barcode is required'
      ],
      category: null,
      colour: null,
      name: null,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      name_ger: null,
      price: null,
      priceRules: [
        v => !!v || 'Price is required'
      ],
      size: null,
      tags: null,
      valid: false
    }
  },
  methods: {
    saveProduct(nextPage) {


      var db = firebaseApp.firestore()
      var counter = 0
      var tmpString = ''
      var vm = this
      db.collection("products").where('barcode', '==', this.barcode).get
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          tmpString = tmpString + ' ' + doc.id
          counter = counter + 1
          this.curProductId = doc.id
        })
        if(counter > 0) {
          forwardDialog = true
        }else{
          db.collection("products")
          .add({
            article_number: vm.article_number,
            barcode: vm.barcode,
            category: vm.category,
            colour: vm.colour,
            name: vm.name,
            price: vm.price,
            size: vm.size
          })
          .then(docRef => {
            if (nextPage == "edit") {
              var newProductId = docRef.id
              vm.$router.push("/edit/" + newProductId)
            }else{
              vm.$router.push("/")
            }
          })
          .catch(error => {
            console.log(error);
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    editBarcode() {
      this.$router.push("/edit/" + this.curProductId)
    },
    abort() {
      this.$router.push('/')
    }
  }
}
</script>