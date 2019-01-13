<template>
  <div id="new">
    <v-form v-model="valid" ref="form">
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
            <div v-if="visible === true">
              <v-text-field
                v-bind:label="$t('price')"
                v-model="amount"
                :rules="priceRules"
                required
                @blur="onBlurNumber"
                type="number"
              >
              </v-text-field>
            </div>
            <div v-if="visible === false">
              <v-text-field
                v-bind:label="$t('price')"
                v-model="amount"
                :rules="priceRules"
                required
                @focus="onFocusText"
                type="text"
              >
              </v-text-field>
            </div>
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
              <v-btn @click="saveProduct('editproduct')" slot="activator"><v-icon>forward</v-icon></v-btn>
              <span>{{$t('save')}} {{$t('and')}} {{$t('editproduct')}}</span>
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
          <v-btn @click.native="editBarcode" color="success">{{$t('editproduct')}}</v-btn>
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
      article_number: '',
      barcode: null,
      barcodeRules: [
        v => !!v || 'Barcode is required'
      ],
      category: '',
      colour: '',
      name: null,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      amount: null,
      temp: null,
      visible: true,
      priceRules: [
        v => !!v || 'Price is required'
      ],
      size: '',
    //  tags: null,
      valid: false
    }
  },
  methods: {
    onBlurNumber(e) {
      console.log(e)
      this.visible = false
      this.temp = this.amount
      this.amount = this.thousandSeprator(this.amount)
    },
    onFocusText() {
      this.visible = true
      this.amount = this.temp
    },
    thousandSeprator(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      } else {
        return amount
      }
    },
    saveProduct(nextPage) {
      if (this.$refs.form.validate()) {
        var db = firebaseApp.firestore()
      var counter = 0
      var tmpString = ''
      var vm = this
      db.collection("products").where('barcode', '==', this.barcode).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          tmpString = tmpString + ' ' + doc.id
          counter = counter + 1
          this.curProductId = doc.id
        })
        if(counter > 0) {
          this.forwardDialog = true
        }else{
          const data = {
            article_number: vm.article_number,
            barcode: vm.barcode,
            category: vm.category,
            colour: vm.colour,
            name: vm.name,
            price: vm.temp,
            size: vm.size
          }
          console.log(data)
          db.collection("products")
          .add(data)
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
      } 
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