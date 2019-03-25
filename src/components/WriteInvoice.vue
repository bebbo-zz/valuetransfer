<template>
  <div id="writeinvoice">
<!-- START Step 1 -->
    <v-container v-if="step === 1">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectcustomer')}}</v-subheader>
          <v-select
            :items="availableCustomers"
            item-text="cust_name"
            item-value="cust_id"
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
                          <v-btn @click.native="takeItem" slot="activator" color="success" large>{{$t('fillin')}}</v-btn> 
                          <span>{{$t('fillin')}}</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <v-btn @click.native="closeDialog" slot="activator" color="error" large>{{$t('cancel')}}</v-btn>    
                          <span>{{$t('cancel')}}</span>
                        </v-tooltip>
                      </v-flex>
        </v-layout>
    </v-container>
<!-- END Step 3 -->

<!-- START Modal Preview -->
    <v-dialog 
      v-model="modalConfirm"
      lazy
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('confirm')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <p>Total Cost for Items: {{ previewItemCost }}</p>
              <p>Total Service Cost: {{ previewServiceCost }}</p>
              <p>Total Amount: {{ previewTotalCost }}</p>
            </v-layout>
            <v-layout row wrap>
                      <v-flex xs12>
                        <v-tooltip top>
                          <v-btn @click.native="generateInvoice" slot="activator" color="success" large>{{$t('ok')}}</v-btn> 
                          <span>{{$t('ok')}}</span>
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
<!-- END Modal Preview -->

  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
import jsPDF from 'jspdf'

export default {
  name: "writeinvoice",
  data() {
    return {
      modalConfirm: false,
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
      availablePercentages: [ 5, 10, 15, 20 ],
      selectedPercentage: null,
      previewItemCost: 0,
      previewServiceCost: 0,
      previewTotalCost: 0,
      internalRef: null
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempCustomers = []
    db.collection('businesspartner').where('type', '==', 'Customer').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'cust_id': doc.id,
            'cust_name': doc.data().name,
            'cust_address': doc.data().address
          }
          console.log(data)
          tempCustomers.push(data)
        })
        next(vm => {
          vm.availableCustomers = tempCustomers
        })
    })
  },
  methods: {
    formatAmount(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2)
        return parseFloat(amount)
      } else {
        return parseFloat(amount)
      }
    },
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
      else this.selected = this.availableStockItems.slice()
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

      this.modalConfirm = true
    },
    generateInvoice()
    {
      // save invoice which also books items
      this.saveInvoice()

      // generate pdf
      this.generatePdf()

      // remove items from stock

    },
    generatePdf() {
      var doc = new jsPDF()

      var counter = 1
      var y = 10
      doc.text('Van Logistics Services', 10, y)
      this.selected.forEach(goodItem => {
      /*  'id': doc.id,
              'barcode': doc.data().barcode,
              'name': doc.data().name,
              'amount': doc.data().amount,
              'quantity': doc.data().quantity */
        y = (counter * 10) + 10
        if(y > 500) {
          doc.addPage()
          y = 10
        }
        doc.text(goodItem.barcode + " - " + goodItem.name, 10, y)
        doc.text(goodItem.amount + " EUR per item", 30, y + 5)
        doc.text(goodItem.quantity + " x", 60, y + 5)
        doc.text(this.formatAmount(goodItem.amount * goodItem.quantity) + " EUR", 80, y + 5)
        counter = counter + 1
      })
      y = (counter * 10) + 10
      if(y > 500) {
        doc.addPage()
        y = 10
      }
      doc.line(10, 100, y, y)
      counter = counter + 1
      y = (counter * 10) + 10
      if(y > 500) {
        doc.addPage()
        y = 10
      }
      doc.text("Total Cost of Goods ", 10, y)
      doc.text(this.previewItemCost + " EUR", 80, y + 5)

      counter = counter + 1
      y = (counter * 10) + 10
      if(y > 500) {
        doc.addPage()
        y = 10
      }
      doc.text("Service Fee " + this.selectedPercentage + "% of costs of goods", 10, y)
      doc.text(this.previewServiceCost + " EUR", 80, y + 5)

      counter = counter + 1
      y = (counter * 10) + 10
      if(y > 500) {
        doc.addPage()
        y = 10
      }
      doc.text("Total Costs", 10, y)
      doc.text(this.previewTotalCost + " EUR", 80, y + 5)

      counter = counter + 1
      y = (counter * 10) + 10
      if(y > 500) {
        doc.addPage()
        y = 10
      }
      doc.line(10, 100, y, y)

      doc.save('new_invoice.pdf')
    },
    saveInvoice() {
      var db = firebaseApp.firestore()
      var vm = this
      const data = {
        type: 'CustomerInvoice',
        status: 'Booked',
        bookingDate: new Date().toISOString().substr(0, 10),
        goodsInvoiced: this.selected,
        itemCost: this.previewItemCost,
        serviceCost: this.previewServiceCost,
        totalCost: this.previewTotalCost
      }
      db.collection("invoices")
        .add(data)
        .then(docRef => {
          vm.internalRef = docRef.id
          vm.saveAccountingEntryGoods()
          vm.saveAccountingEntryProfit()
        })
        .catch(error => {
          console.log(error)
        })  
    },
    saveAccountingEntryGoods() {
      var db = firebaseApp.firestore()
      const data = {
        invoiceRef: this.internalRef,
        bookingDate: new Date().toISOString().substr(0, 10),
        sign: 1,
        type: 'Warenausgang',
        comment: 'goods paid',
        amount: this.previewItemCost
      }
      db.collection("accoutingentries")
        .add(data)
        .then()
        .catch(error => {
          console.log(error)
        })  
    },
    saveAccountingEntryProfit() {
      var db = firebaseApp.firestore()
      const data = {
        invoiceRef: this.internalRef,
        bookingDate: new Date().toISOString().substr(0, 10),
        sign: 1,
        type: 'Ertrag',
        comment: this.selectedPercentage + '% of goods amount',
        amount: this.previewServiceCost
      }
      db.collection("accoutingentries")
        .add(data)
        .then()
        .catch(error => {
          console.log(error)
        }) 
    },
    closeDialog() {
      this.modalConfirm = false
    }
  }
}
</script>

