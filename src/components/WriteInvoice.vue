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
          <v-list two-line>
            <template v-for="(item, index) in availableStockItems">
              <v-list-tile
                :key="index"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }} - {{ item.quantity }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.averagecost }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < availableStockItems.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
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
            <v-btn @click.native="next" slot="activator" color="success" large>{{$t('generateinvoice')}}</v-btn> 
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
      availablePercentages: [ 0.05, 0.1, 0.15, 0.2 ],
      availableStockItems: [],
      selectedCustomer: null,
      selectedItems: [],
      selectedPercentage: null
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
              'name': doc.data().name,
              'averagecost': doc.data().averagecost,
              'quantity': doc.data().quantity
            }
            tempStock.push(data)
          })
          vm.availableStockItems = tempStock
          vm.stockItemsFilled = true
      })
    }
  }
}
</script>

