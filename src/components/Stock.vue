<template>
  <div id="stock">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="stockItems"
            class="elevation-1"
            :rows-per-page-items="rowsperpage"
          >
            <template v-slot:items="props">
              <tr @click="editItem(props.item)">
                <td>{{ props.item.barcode }}</td>
                <td class="text-xs-right">{{ props.item.intake_price }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.translation }}</td>
                <td class="text-xs-right">{{ props.item.description }}</td>
                <td class="text-xs-right">{{ props.item.order_price }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

<!-- START Modal Edit Item -->
    <v-dialog 
      v-model="modelEditItem"
      lazy
      persistent max-width="800px">
      <v-card>
        <!--v-card-title>
          <span class="headline">{{$t('newCostItem')}}</span>
        </v-card-title-->
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs5>
                <v-text-field
                  v-bind:label="$t('barcode')"
                  v-model="display_barcode"
                  disabled
                >
                </v-text-field>
              </v-flex>
              <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('articlenumber')"
                          v-model="update_article_number"
                        >
                        </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-bind:label="$t('name')"
                  v-model="update_name"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-bind:label="$t('translation')"
                  v-model="update_translation"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-bind:label="$t('description')"
                  v-model="update_description"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-tooltip top>
                  <v-btn @click.native="updateItem" slot="activator" color="success" large>{{$t('save')}}</v-btn>    
                  <span>{{$t('save')}}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn @click.native="closeDialog" slot="activator" color="error" large>{{$t('cancel')}}</v-btn>    
                  <span>{{$t('cancel')}}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
<!-- END Modal Edit Item -->
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
import _ from 'lodash'

export default {
  name: "stock",
  data() {
    return {
      modelEditItem: false,
      headers: [
          { text: 'Barcode', align: 'left', sortable: false, value: 'barcode' },
          { text: 'Purchase Price', value: 'intake_price' },
          { text: 'Quantity', value: 'quantity' },
          { text: 'Name', value: 'name' },
          { text: 'Translation', value: 'translation' },
          { text: 'Description', value: 'description' },
          { text: 'Sells Price', value: 'order_price' }
        ],
      rowsperpage: [10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
      stockItems: [],
      selectedItem: null,
      display_barcode: null,
      update_name: null,
      update_translation: null,
      update_article_number: null,
      update_description: null
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempStock = []
    var allProducts = []
    db.collection('stock').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
           // 'id': doc.id,
            'barcode': doc.data().barcode,
           // 'name': doc.data().name,
            'amount': parseFloat(doc.data().amount),
            'quantity': doc.data().quantity
          }
          tempStock.push(data)
        })

        db.collection('products').get()
          .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var data = {
              'productref': doc.id,
              'barcode': doc.data().barcode,
              'article_number': doc.data().article_number,
              'name': doc.data().name,
              'amount': doc.data().amount,
              'quantity': doc.data().quantity
            }
            allProducts.push(data)
          })

          /*var dataByBarcode = tempStock.reduce(function(dataByBarcode, item){
            var value = item.quantity
            var group = item.barcode
            dataByBarcode[group] = (dataByBarcode[group] || 0) + value
            return dataByBarcode
          }, {})
          console.log("data by barcode : ")
          console.log(dataByBarcode)*/
          
          var stockByBarcode =
            _(tempStock)
            .groupBy('barcode')
            .map((objs, key) => ({
              'barcode': key,
              'quantity': _.sumBy(objs, 'quantity'),
              'intake_price': _.sumBy(objs, 'amount') }))
            .value()
          // 'intake_price': _.sumBy(objs, 'amount') / _.sumBy(objs, 'quantity') }))
          var joinedArray = []
          var found = false
          stockByBarcode.forEach(stockJson => {
            var joinedEntry = stockJson
            var barcode = stockJson['barcode']
              found = false
              var indexToRemove = 0
              for (let i = 0; i < allProducts.length; i++) {
                var productJson = allProducts[i]
                if (productJson['barcode'] == barcode) {
                  found = true
                  joinedEntry['name'] = productJson['name']
                  joinedEntry['productref'] = productJson['productref']
                  if(!(productJson['description'] == undefined)) {
                    joinedEntry['description'] = productJson['description']
                  }else{
                    joinedEntry['description'] = ""
                  }
                  if(!(productJson['article_number'] == undefined)) {
                    joinedEntry['article_number'] = productJson['article_number']
                  }else{
                    joinedEntry['article_number'] = ""
                  }
                  if(!(productJson['translation'] == undefined)) {
                    joinedEntry['translation'] = productJson['translation']
                  }else{
                    joinedEntry['translation'] = ""
                  }
                  indexToRemove = i
                  break
                }
              }
              if(found) {
                allProducts.splice(indexToRemove, 1)
              }
              joinedArray.push(joinedEntry)
          })
          next(vm => {
            vm.stockItems = joinedArray
          })
        })
    })
  },
  methods: {
    editItem(_selectedItem) {
      this.selectedItem = _selectedItem
      this.display_barcode = _selectedItem.barcode
      this.update_name = _selectedItem.name
      this.update_translation = _selectedItem.translation
      this.update_article_number = _selectedItem.article_number
      this.update_description = _selectedItem.description
      this.modelEditItem = true
    },
    updateItem() {
      var db = firebaseApp.firestore()
      var vm = this
      const data = {
        article_number: this.update_article_number,
        name: this.update_name,
        translation: this.update_translation,
        description: this.update_description
      }
      var productToUpdate = db.collection("products").doc(this.selectedItem.productref)
      productToUpdate.set({
        data
      })
      .then(function() {
        vm.closeDialog()
      })
      .catch(error => {
        console.log(error)
      })
    },
    closeDialog() {
      this.modelEditItem = false
    }
  }
}
</script>

