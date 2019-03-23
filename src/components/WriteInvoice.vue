<template>
  <div id="writeinvoice">
<!-- START Step 1 -->
    <v-container v-if="step === 1">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectcustomer')}}</v-subheader>
          <v-select
            :items="availableCustomers"
                          box
                          v-bind:label="$t('selectcustomer')"
                          v-model="selectedCustomer" 
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-tooltip top>
            <v-btn @click.native="next" slot="activator" color="success" large>{{$t('next')}}</v-btn> 
            <span>{{$t('next')}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
<!-- END Step 1 -->

<!-- START Step 2 -->
    <v-container v-if="step === 2">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectitems')}}</v-subheader>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="availableStockItems"
            :pagination.sync="pagination"
            select-all
            item-key="name"
            class="elevation-1"
          >
            <template v-slot:headers="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.stop="toggleAll"
                  ></v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template v-slot:items="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                  <v-checkbox
                    :input-value="props.selected"
                    primary
                    hide-details
                  ></v-checkbox>
                </td>
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.barcode }}</td>
                <td class="text-xs-right">{{ props.item.amount }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-tooltip top>
            <v-btn @click.native="back" slot="activator" color="error" large>{{$t('back')}}</v-btn>    
            <span>{{$t('back')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click.native="next" slot="activator" color="success" large>{{$t('next')}}</v-btn> 
            <span>{{$t('next')}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
<!-- END Step 2 -->

<!-- START Step 3 -->
    <v-container v-if="step === 3">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectfee')}}</v-subheader>
          <v-select
            :items="availablePercentages"
            box
            v-bind:label="$t('selectfee')"
            v-model="selectedPercentage" 
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-tooltip top>
            <v-btn @click.native="back" slot="activator" color="error" large>{{$t('back')}}</v-btn>    
            <span>{{$t('back')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click.native="previewInvoice" slot="activator" color="success" large>{{$t('generateinvoice')}}</v-btn> 
            <span>{{$t('generateinvoice')}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
<!-- END Step 3 -->

  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "writeinvoice",
  data() {
    return {
      step: 1,
      stockItemsFilled: false,
      availableCustomers: [],
      selectedCustomer: null,
      availableStockItems: [],
      headers: [
          { text: 'Barcode', align: 'left', sortable: false, value: 'barcode' },
          { text: 'Name', value: 'name' },
          { text: 'Purchase Price', value: 'amount' },
          { text: 'Quantity', value: 'quantity' }
        ],
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      availablePercentages: [ 0.05, 0.1, 0.15, 0.2 ],
      selectedPercentage: null,
      previewItemCost: 0,
      previewServiceCost: 0,
      previewTotalCost: 0
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempCustomers = []
    db.collection('businesspartners').where('type', '==', 'Customer').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'cust_id': doc.id,
            'cust_name': doc.data().name,
            'cust_address': doc.data().address
          }
          tempCustomers.push(data)
        })
        next(vm => {
          vm.avaialableCustomers = tempCustomers
        })
    })
  },
  methods: {
    back() {
      this.step = this.step - 1
    },
    next() {
      this.step = this.step + 1
      if((this.step === 2) && (this.stockItemsFilled === false)) {
        this.fillStockItems()
      }
    },
    fillStockItems() {
      var db = firebaseApp.firestore()
      var tempStock = []
      var vm = this
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
          vm.availableStockItems = tempStock
          vm.stockItemsFilled = true
      })
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    previewInvoice() {
      // calculate sum
      var tempItemCost = 0
      this.selected.forEach(selectedItem => {
        tempItemCost = tempItemCost + parseFloat(selectedItem.amount)
      })
      this.previewItemCost = tempItemCost
      this.previewServiceCost = tempItemCost * (parseFloat(this.selectedPercentage) / 100)
      this.previewTotalCost = this.previewItemCost + this.previewServiceCost
      console.log("total cost " + this.previewTotalCost)
    },
    generateInvoice()
    {
      // save invoice

      // book cost items

      // remove items from stock

    },
    saveInvoice() {
      var db = firebaseApp.firestore()
      const data = {
        type: 'CustomerInvoice',
        status: 'Booked',
        bookingDate: new Date().toISOString().substr(0, 10),
        goodsInvoiced: this.selected,
        itemCost: this.previewItemCost,
        serviceCost: this.previewServiceCost,
        totalCost: this.previewTotalCost
      }
      var vm = this
      db.collection("invoices")
        .add(data)
        .then()
        .catch(error => {
          console.log(error)
        })  
    }
  }
}
</script>

