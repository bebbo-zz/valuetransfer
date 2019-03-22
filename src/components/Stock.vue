<template>
  <div id="stock">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="stockItems"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>{{ props.item.barcode }}</td>
              <td class="text-xs-right">{{ props.item.intake_price }}</td>
              <td class="text-xs-right">{{ props.item.quantity }}</td>
              <td class="text-xs-right">{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.translation }}</td>
              <td class="text-xs-right">{{ props.item.description }}</td>
              <td class="text-xs-right">{{ props.item.order_price }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "stock",
  data() {
    return {
      headers: [
          { text: 'Barcode', align: 'left', sortable: false, value: 'barcode' },
          { text: 'Purchase Price', value: 'intake_price' },
          { text: 'Quantity', value: 'quantity' },
          { text: 'Name', value: 'name' },
          { text: 'Translation', value: 'translation' },
          { text: 'Description', value: 'description' },
          { text: 'Sells Price', value: 'order_price' }
        ],
      stockItems: []
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempStock = []
    var tempProducts = []
    db.collection('stock').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'id': doc.id,
            'barcode': doc.data().barcode,
            'name': doc.data().name,
            'amount': doc.data().amount,
            'quantity': doc.data().quantity
          }
          tempStock.push(data)
        })
        db.collection('products').get()
          .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var data = {
              'id': doc.id,
              'barcode': doc.data().barcode,
              'name': doc.data().name,
              'amount': doc.data().amount,
              'quantity': doc.data().quantity
            }
            tempProducts.push(data)
          })
          var stockByBarcode =
            _(tempStock)
            .groupBy('barcode')
            .map((objs, key) => ({
              'barcode': key,
              'quantity': _.sumBy(objs, 'quantity'),
              'intake_price': _.sumBy(objs, 'amount') / _.sumBy(objs, 'quantity') }))
            .value()

          console.log(stockByBarcode)
          var joinedEntry = []
          stockByBarcode.forEach(stockJson => {
            joinedEntry = stockJson
            var barcode = stockJson['barcode']
              found = false
              var indexToRemove = 0
              for (let i = 0; i < allProducts.length; i++) {
                var productJson = allProducts[i]
                if (productJson['barcode'] == barcode) {
                  found = true
                  joinedEntry['name'] = productJson['name']
                  if(!(productJson['description'] == undefined)) {
                    joinedEntry['description'] = productJson['description']
                  }else{
                    joinedEntry['description'] = ""
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
          })
          next(vm => {
            vm.stockItems = joinedEntry
          })
        })
    })
  }
}
</script>

