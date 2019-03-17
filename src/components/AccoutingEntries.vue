<template>
  <div id="accoutingentries">

    <!-- START View Selection -->
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-btn-toggle>
            <v-btn flat @click='viewChange(true)'>Accounting Entries</v-btn>
            <v-btn flat @click='viewChange(false)'>Invoices</v-btn>
          </v-btn-toggle>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- END View Selection -->

    <!-- START Accounting List -->    
    <v-container v-if="accountingView === true">
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <template v-for="(item, index) in accountingEntries">
              <v-list-tile
                :key="index"
                @click="editCostItem(index)"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.type }} - {{ item.amount }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < accountingEntries.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- END Accounting List -->    

    <!-- START Invoice List -->    
    <v-container v-if="accountingView === false">
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <template v-for="(item, index) in invoices">
              <v-list-tile
                :key="index"
                @click="editCostItem(index)"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.type }} - {{ item.amount }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < invoices.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- END Invoice List --> 

    <!-- START Modal Add Item -->
    <v-dialog 
      v-model="modalAddAccoutingEntry"
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('newAccountingEntry')}}</span>
        </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout row wrap>
                        <v-flex xs5>
                          <v-select
                            :items="profittypes"
                            box
                            v-bind:label="$t('profittype')"
                            v-model="type" 
                          ></v-select>
                        </v-flex>
                        <v-flex xs5 offset-xs1>
                          <v-text-field
                            v-bind:label="$t('costamount')"
                            v-model="amount"
                          >
                          </v-text-field>
                        </v-flex>
              </v-layout>
              <v-layout row wrap>
                        <v-flex xs5>
                          <v-select
                            :items="availableInvoices"
                            box
                            v-bind:label="$t('writteninvoices')"
                            v-model="refInvoice" 
                          ></v-select>
                        </v-flex>
                        <v-flex xs5 offset-xs1>
                          <v-text-field
                            v-bind:label="$t('paymentreceived')"
                            v-model="paymentDate"
                          >
                          </v-text-field>
                        </v-flex>
              </v-layout>
              <v-layout row wrap>
                        <v-flex xs12>
                          <v-text-field
                            v-bind:label="$t('comment')"
                            v-model="comment"
                          >
                          </v-text-field>
                        </v-flex>
              </v-layout>
              <v-layout row wrap>
                        <v-flex xs12>
                          <v-tooltip top>
                            <v-btn @click.native="saveAccoutingEntry" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
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
    <!-- END Modal Add Item -->

  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "accoutingentries",
  data() {
    return {
      modalAddAccoutingEntry: false,
      accountingView: true,
      invoices: [],
      accountingEntries: []
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempInvoices = []
    var tempAccoutingEntries = []
    db.collection('invoices').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'internalRef': doc.id,
            'invoiceNumber': doc.data().invoiceNumber,
            'bookingDate': doc.data().bookingDate,
            'supplier': doc.data().supplier,
            'totalBookedAmount': doc.data().totalBookedAmount
          }
          tempInvoices.push(data)
        })
        db.collection('accoutingentries').get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var data = {
                'internalRef': doc.id,
                'basedOnInvoice': doc.data().basedOnInvoice,
                'bookingDate': doc.data().bookingDate,
                'sign': doc.data().sign,
                'amount': doc.data().amount,
                'type': doc.data().type
              }
              tempAccoutingEntries.push(data)
            })
            next(vm => {
              vm.invoices = tempInvoices
              vm.accountingEntries = tempAccoutingEntries
            })
        })
    })
    // two db calls 
    // accoutingentries
  },
  methods: {
    viewChange( showAccountingBool ) {
      this.accountingView = showAccountingBool
    },
    addAccoutingEntry() {
      this.modalAddAccoutingEntry = true
    },
    saveAccoutingEntry() {
      // add to DB
      this.closeDialog()
    },
    closeDialog() {
      this.accountingView = false
    }
  }
}
</script>
