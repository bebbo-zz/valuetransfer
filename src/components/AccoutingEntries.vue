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
      <v-btn
            color="pink"
            dark
            fixed
            bottom
            right
            fab
            @click='addAccoutingEntry'
          >
            <v-icon>add</v-icon>
          </v-btn>
    </v-container>
    <!-- END View Selection -->

    <!-- START Accounting List -->    
    <v-container v-if="accountingView === true">
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <template v-for="(item, index) in accountingEntries">
              <v-list-tile
                :key="index + '_entry'"
                @click="editCostItem(index)"
                >
                <v-list-tile-action>
                  <v-icon v-if="item.sign == 1" color="indigo">add</v-icon>
                  <v-icon v-if="item.sign == -1" color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.bookingDate }} - {{ item.type }} - {{ item.amount }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < accountingEntries.length"
                :key="index + '_entry_divider'"
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
                :key="index + '_invoice'"
                @click="editCostItem(index)"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.bookingDate }} - {{ item.invoiceNumber }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.supplierName }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < invoices.length"
                :key="index + '_invoice_divider'"
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
                            v-model="newtype" 
                          ></v-select>
                        </v-flex>
                        <v-flex xs5 offset-xs1>
                          <v-text-field
                            v-bind:label="$t('costamount')"
                            v-model="newamount"
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
                          <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="paymentDate"
                            persistent
                            lazy
                            full-width
                            width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="paymentDate"
                                v-bind:label="$t('paymentreceived')"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="paymentDate" scrollable>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dialog.save(paymentDate)">OK</v-btn>
                            </v-date-picker>
                          </v-dialog>
                          <!--v-text-field
                            v-bind:label="$t('paymentreceived')"
                            v-model="paymentDate"
                          >
                          </v-text-field-->
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
      modal: false,
      modalAddAccoutingEntry: false,
      accountingView: true,
      invoices: [],
      accountingEntries: [],
      profittypes: ['Invoice Paid', 'Other Income'],
      newtype: null,
      newamount: 0,
      availableInvoices: [],
      refInvoice: null,
      paymentDate: new Date().toISOString().substr(0, 10),
      comment: null
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempInvoices = []
    var tempAccoutingEntries = []
    db.collection('invoices').where('status', '==', 'Booked').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'internalRef': doc.id,
            'invoiceNumber': doc.data().invoiceNumber,
            'bookingDate': doc.data().bookingDate,
            'supplierName': 'need to fix',
          }
          tempInvoices.push(data)
        })
        db.collection('accoutingentries').get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var data = {
                'internalRef': doc.id,
                'invoiceRef': doc.data().invoiceRef,
                'bookingDate': doc.data().bookingDate,
                'sign': doc.data().sign,
                'amount': doc.data().amount,
                'type': doc.data().type,
                'comment': doc.data().comment
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
      this.getCustomerInvoices()
      this.modalAddAccoutingEntry = true
    },
    saveAccoutingEntry() {
      // add to DB
      this.closeDialog()
    },
    getCustomerInvoices() {
      var db = firebaseApp.firestore()
      var tempInvoices = []
      db.collection('invoices').where('type', '==', 'CustomerInvoice').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var data = {
              'internalRef': doc.id,
              'invoiceNumber': doc.data().invoiceNumber,
              'bookingDate': doc.data().bookingDate
            }
            tempInvoices.push(data)
          })
          next(vm => {
            vm.availableInvoices = tempInvoices
          })
      })
    },
    closeDialog() {
      this.accountingView = false
      this.modalAddAccoutingEntry = true
    }
  }
}
</script>
