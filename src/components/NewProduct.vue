<template>
  <div id="new-product">
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
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-bind:label="$t('namegerman')"
              v-model="name_ger"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
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
          <!-- @submit.prevent="updateProduct" -->
          <v-flex xs6>
            <v-text-field
              v-bind:label="$t('price')"
              v-model="price"
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
          <v-flex xs12>
            <v-divider></v-divider>
            <v-tooltip top>
              <v-btn @click="saveProduct" slot="activator"><v-icon>save</v-icon></v-btn>
              <span>{{$t('save')}}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn @click="abort" slot="activator"><v-icon>highlight_off</v-icon></v-btn>
              <span>{{$t('cancel')}}</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
// import db from './firebaseInit'
import firebaseApp from "./firebaseInit";

export default {
  name: "new-product",
  data() {
    return {
      product_id: null,
      article_number: null,
      barcode: null,
      barcodeRules: [
        v => !!v || 'Barcode is required',
        v => this.checkBarcode(v) == true || 'Barcode already exists'
      ],
      category: null,
      colour: null,
      name: null,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      name_ger: null,
      price: null,
      size: null,
      tags: null,
      valid: false
    }
  },
  methods: {
    saveProduct() {
      var db = firebaseApp.firestore();

      db.collection("products")
        .add({
          article_number: this.article_number,
          barcode: this.barcode,
          category: this.category,
          colour: this.colour,
          description: this.description,
          name: this.name,
          name_ger: this.name_ger,
          price: this.price,
          size: this.size
        })
        .then(
          this.$router.push("/")
        )
        .catch(error => {
          console.log(error);
        })
    },
    abort() {
      this.$router.push('/')
    }
  },
  checkBarcode(curBarcode) {
    var counter = 0
    db.collection("products").where('barcode', '==', curBarcode).get
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            counter = counter + 1
          })
          if(counter > 0) {
            return false
          }else{
            return true
          }
      })
      .catch(error => {
          console.log(error)
          return true
    })
  }
}
</script>