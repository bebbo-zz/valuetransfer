<template>
  <div id="newcost">
    
<!-- START General Information -->
    <v-container>
      <v-layout row wrap>
        <v-flex xs5>
          <v-text-field
            v-bind:label="$t('internalRef')"
            v-model="internalRef"
            disabled
          >
          </v-text-field>
        </v-flex>
        <v-flex xs5 offset-xs1>
          <v-text-field
            v-bind:label="$t('bookingDate')"
            v-model="bookingDate"
            disabled
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs5>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="invoiceDate"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="invoiceDate"
                v-bind:label="$t('invoiceDate')"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="invoiceDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(invoiceDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <!--v-text-field
            v-bind:label="$t('invoiceDate')"
            v-model="invoiceDate"
          >
          </v-text-field-->
        </v-flex>
        <v-flex xs5 offset-xs1>
          <v-text-field
            v-bind:label="$t('invoiceNumber')"
            v-model="invoiceNumber"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs5>
          <v-select
            :items="availableSuppliers"
            item-text="sup_name"
            item-value="sup_id"
            box
            v-bind:label="$t('invoiceSupplier')"
            v-model="selectedSupplier"
            v-on:change="changeSupplier" 
          ></v-select>
        </v-flex>
        <v-flex xs5 offset-xs1>
          <v-text-field
            v-bind:label="$t('invoiceUstNr')"
            v-model="invoiceUstNr"
            disabled
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-radio-group v-model="usthandling" row>
            <v-radio label="Prices incl. 19% VAT" value="incl19"></v-radio>
            <v-radio label="Prices incl. 7% VAT" value="incl7"></v-radio>
            <v-radio label="Prices are exlcusive VAT" value="excl"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
      <v-btn
            color="pink"
            dark
            fixed
            bottom
            right
            fab
            @click='addCostItem'
          >
            <v-icon>add</v-icon>
          </v-btn>
    </v-container>
<!-- END General Information -->

<!-- START List -->
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('invoiceitems')}}</v-subheader>
          <v-expansion-panel>
            <v-expansion-panel-content>
              <template v-slot:header>
                <div>{{ sumedGoodsReceipt.type }} - {{ sumedGoodsReceipt.amount }} €</div>
              </template>
                      <v-card>
                        <v-list two-line>
                          <template v-for="(item, index) in goodsReceipt">
                            <v-list-tile
                              :key="index + '_goodReceipt'"
                              @click="editGoodsReceipt(index)"
                              >
                              <v-list-tile-action>
                                <!--v-icon color="indigo">add</v-icon-->
                                <v-icon color="indigo">remove</v-icon>
                              </v-list-tile-action>

                              <v-list-tile-content>
                                <v-list-tile-title>{{ item.name }} - {{ item.amount }} € - {{item.quantity}} x</v-list-tile-title>
                                <v-list-tile-sub-title>{{ item.barcode }}</v-list-tile-sub-title>
                              </v-list-tile-content>

                              <v-list-tile-action>
                                <v-icon>edit</v-icon>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider
                              v-if="index + 1 < goodsReceipt.length"
                              :key="index + '_goodReceipt_divider'"
                            ></v-divider>
                          </template>
                        </v-list>
                        <!-- und hier muss dann eine liste hin >
                        <v-card-text>Loadipi sed domco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text-->
                      </v-card>
                    </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ sumedGoodsUmst.type }} - {{ sumedGoodsUmst.amount }} €</v-list-tile-title>
                  <v-list-tile-sub-title>{{ sumedGoodsUmst.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>add</v-icon>
                </v-list-tile-action>
              </v-list-tile>
          </v-list>
          <v-list two-line>
            <template v-for="(item, index) in otherAccountingEntries">
              <v-list-tile
                :key="index"
                @click="editCostItem(index)"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.type }} - {{ item.amount }} €</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < otherAccountingEntries.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
<!-- END List -->

<!-- START Actions-->
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-tooltip top>
            <v-btn @click.native="loadDraft" v-bind:disabled="viewMode" slot="activator" color="warning" large>{{$t('loaddraft')}}</v-btn> 
            <span>{{$t('loaddraft')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click.native="saveInvoice('Draft')" v-bind:disabled="viewMode" slot="activator" color="warning" large>{{$t('saveasdraft')}}</v-btn> 
            <span>{{$t('save')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click.native="bookCost" v-bind:disabled="viewMode" slot="activator" color="success" large>{{$t('bookinvoice')}}</v-btn> 
            <span>{{$t('bookinvoice')}}</span>
          </v-tooltip>
          <v-tooltip top>
          <v-btn @click.native="abort" slot="activator" color="error" large>{{$t('cancel')}}</v-btn>    
            <span>{{$t('cancel')}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field v-bind:label="$t('addpage')" @click='pickFile' v-model='file' prepend-icon='attach_file'></v-text-field>
            <input
                type="file"
                style="display: none"
                ref="invoice"
                accept="*/*"
                @change="onFilePicked"
            >
        </v-flex>
      </v-layout>
    </v-container>
<!-- END Actions -->

<!-- START Modal Add Item -->
    <v-dialog 
      v-model="modalAddCostItem"
      lazy
      persistent max-width="800px">
      <v-card>
        <!--v-card-title>
          <span class="headline">{{$t('newCostItem')}}</span>
        </v-card-title-->
        <v-card-text>
          <v-tabs
            centered
            dark
            icons-and-text
            v-model="active_tab"
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab href="#tab-1">
              Goods Receipt
              <v-icon>all_inbox</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              Other Cost
              <v-icon>feedback</v-icon>
            </v-tab>

            <v-tab href="#tab-3">
              Search Product
              <v-icon>search</v-icon>
            </v-tab>

            <v-tab-item
              key="1"
              value="tab-1"
            >
              <v-card flat>
                <v-card-text>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs5>
                        <v-text-field
                          v-bind:label="$t('barcode')"
                          v-model="newin_barcode"
                          ref="barcode"
                          @input="checkBarcode"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs5>
                        <v-text-field
                          v-bind:label="$t('goodsreceiptamount')"
                          v-model="newin_amount"
                          type="text"
                          prefix="€"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('quantity')"
                          v-model="newin_quantity"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-bind:label="$t('name')"
                          v-model="newin_name"
                          ref="productname"
                          v-bind:disabled="newin_name_disabled"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-tooltip top>
                          <v-btn @click.native="saveandnext" slot="activator" color="success" large>{{$t('next')}}</v-btn> 
                          <span>{{$t('next')}}</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <v-btn @click.native="saveandclose" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
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
            </v-tab-item>

            <v-tab-item
              key="2"
              value="tab-2"
            >
              <v-card flat>
                <v-card-text>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs5>
                        <v-select
                          :items="costtypes"
                          box
                          v-bind:label="$t('costtype')"
                          v-model="newin_costtype" 
                        ></v-select>
                      </v-flex>
                      <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('costamount')"
                          v-model="newin_costamount"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-bind:label="$t('comment')"
                          v-model="newin_costcomment"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-tooltip top>
                          <v-btn @click.native="saveCostItem" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
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
            </v-tab-item>

            <v-tab-item
              key="3"
              value="tab-3"
            >
              <v-card flat>
                <v-card-text>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs5>
                        <v-text-field
                          v-bind:label="$t('barcode')"
                          v-model="search_barcode"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('name')"
                          v-model="search_name"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs5>
                        <v-text-field
                          v-bind:label="$t('articlenumber')"
                          v-model="search_article_number"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('translation')"
                          v-model="search_translation"
                        >
                        </v-text-field>
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
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-dialog>
<!-- END Modal Add Item -->

<!-- START Modal Load Draft -->
    <v-dialog 
      v-model="modalOpenDraft"
      lazy
      persistent max-width="800px">
      <v-card>
        <!--v-card-title>
          <span class="headline">{{$t('newCostItem')}}</span>
        </v-card-title-->
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-list two-line>
                          <template v-for="(item, index) in availabledrafts">
                            <v-list-tile
                              :key="index + '_draft'"
                              @click="loadDataFromDraft(item.draftid)"
                              >
                              <v-list-tile-action>
                                <!--v-icon color="indigo">add</v-icon-->
                                <v-icon color="indigo">remove</v-icon>
                              </v-list-tile-action>

                              <v-list-tile-content>
                                <v-list-tile-title>{{ item.invoiceNumber }} - {{ item.supplierName }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ item.systemdate }}</v-list-tile-sub-title>
                              </v-list-tile-content>

                              <v-list-tile-action>
                                <v-icon>open</v-icon>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider
                              v-if="index + 1 < availabledrafts.length"
                              :key="index + '_draft_divider'"
                            ></v-divider>
                          </template>
                </v-list>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
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
<!-- END Modal Load Draft -->
    
<!-- START Modal Warning -->
    <v-dialog 
      v-model="modalWarning"
      lazy
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{warningText}}</span>
        </v-card-title>
        <v-card-text>
          <v-tooltip top>
            <v-btn @click.native="closeDialog" slot="activator" color="error" large>{{$t('cancel')}}</v-btn>    
            <span>{{$t('cancel')}}</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
    </v-dialog>
<!-- END Modal Warning -->
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "newcost",
  data() {
    return {
      viewMode: false,
      modalAddCostItem: false,
      modalOpenDraft: false,
      modalWarning: false,
      warningText: null,
      active_tab: 1,
      costtypes: [],
      availableSuppliers: [],
      availabledrafts: [],
      newin_costtype: null,
      newin_costamount: null,
      newin_costcomment: null,
      newin_barcode: null,
      newin_name: null,
      newin_name_disabled: false,
      newin_amount: null,
      newin_quantity: 1,
      invoiceUstNr: null,
      internalRef: null,
      bookingDate: new Date().toISOString().substr(0, 10),
      modal: false,
      invoiceNumber: null,
      invoiceDate: new Date().toISOString().substr(0, 10),
      selectedSupplier: null,
      supplierName: null,
      usthandling: 'incl19',
      atLeastOneGoodsReceipt: false,
      sumedGoodsReceipt: {
        type: 'Wareneinkauf',
        amount: 0.00,
        comment: 'Sum of Goods Receipt'
      },
      sumedGoodsUmst: {
        type: 'Umsatzsteuer',
        amount: 0.00,
        comment: 'Sum of Umsatzsteuer'
      },
      goodsReceipt: [],
      otherAccountingEntries: [],
      file: null,
      fileName: null,
      fileUrl: null,
      fileFile: null,
      numberOfInvoicePages: 0,
      search_barcode: null,
      search_name: null,
      search_article_number: null,
      search_translation: null
      // type, amount, comment (MwSt always separate)
      // when enter amount select if gross or net
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempSuppliers = []
    db.collection('businesspartner').where('type', '==', 'Supplier').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'sup_id': doc.id,
            'sup_name': doc.data().name,
            'sup_ustnbr': doc.data().ustnbr
          }
          tempSuppliers.push(data)
        })
        next(vm => {
          vm.availableSuppliers = tempSuppliers
        })
    })
  },
  beforeMount ( ) {
    this.costtypes = process.env.VUE_APP_COSTTYPES.split(',')
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
    addCostItem() {
      this.active_tab = 1
      this.modalAddCostItem = true
      this.$nextTick(() => this.$refs.barcode.focus())
    },
    saveCostItem() {
      var data = {
        'type': this.newin_costtype,
        'amount': this.newin_costamount,
        'comment': this.newin_costcomment,
      }
      this.otherAccountingEntries.push(data)
      this.closeDialog()
    },
    checkBarcode() {
      var db = firebaseApp.firestore()
      var vm = this
      this.newin_name_disabled = false
      this.newin_name = ""
      db.collection("products").where('barcode', '==', this.newin_barcode).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          vm.newin_name = doc.data().name
          vm.newin_name_disabled = true
        })
      })
    },
    saveandnext() {
      this.saveGoodReceipt()
      this.resetDialog()
      this.$nextTick(() => this.$refs.barcode.focus())
    },
    saveandclose() {
      this.saveGoodReceipt()
      this.closeDialog()
    },
    saveGoodReceipt() {
      var data = {
        'barcode': this.newin_barcode,
        'amount': this.formatAmount(this.newin_amount * 0.81),
        'quantity': this.newin_quantity,
        'name': this.newin_name,
      }
      this.goodsReceipt.push(data)
      this.atLeastOneGoodsReceipt = true
      console.log(this.newin_quantity * this.newin_amount * 0.81)
      console.log(this.formatAmount(this.newin_quantity * this.newin_amount * 0.81))
      this.sumedGoodsReceipt.amount = this.formatAmount(this.sumedGoodsReceipt.amount + (this.newin_quantity * this.newin_amount * 0.81))
      this.sumedGoodsUmst.amount = this.formatAmount(this.sumedGoodsUmst.amount + (this.newin_quantity * this.newin_amount * 0.19))
    },
    resetDialog() {
      this.newin_barcode = null
      this.newin_name = null
      this.newin_amount = null
      this.newin_quantity = 1
      this.newin_costtype = null
      this.newin_costamount = null
      this.newin_costcomment = null
    },
    closeDialog() {
      this.resetDialog()
      this.modalAddCostItem = false
      this.modalOpenDraft = false
      this.modalWarning = false
    },
    editCostItem (index) {
      this.active_tab = 2
      var data = this.otherAccountingEntries[index]
      this.newin_costtype = data.type
      this.newin_costamount = data.amount
      this.newin_costcomment = data.comment
      this.modalAddCostItem = true
    },
    editGoodsReceipt (index) {
      this.active_tab = 1
      var data = this.goodsReceipt[index]
      this.newin_barcode = data.barcode
      this.newin_amount = data.amount
      this.newin_quantity = data.quantity
      this.newin_name = data.name
      this.modalAddCostItem = true
    },
    saveFirstTime(_status) {
      var db = firebaseApp.firestore()
      const data = {
        type: 'SupplierInvoice',
        status: _status,
        invoiceUstNr: this.invoiceUstNr,
        bookingDate: this.bookingDate,
        invoiceNumber: this.invoiceNumber,
        invoiceDate: this.invoiceDate,
        selectedSupplier: this.selectedSupplier,
        supplierName: this.supplierName,
        usthandling: 'incl19',
        atLeastOneGoodsReceipt: this.atLeastOneGoodsReceipt,
        sumedGoodsReceipt: this.sumedGoodsReceipt,
        sumedGoodsUmst: this.sumedGoodsUmst,
        goodsReceipt: this.goodsReceipt,
        otherAccountingEntries: this.otherAccountingEntries
      }
      var vm = this
      db.collection("invoices")
        .add(data)
        .then(docRef => {
          vm.internalRef = docRef.id
        })
        .catch(error => {
          console.log(error)
        })  
    },
    updateInvoice(_status) {
      var db = firebaseApp.firestore()
      const data = {
        type: 'SupplierInvoice',
        status: _status,
        invoiceUstNr: this.invoiceUstNr,
        bookingDate: this.bookingDate,
        invoiceNumber: this.invoiceNumber,
        invoiceDate: this.invoiceDate,
        selectedSupplier: this.selectedSupplier,
        supplierName: this.supplierName,
        usthandling: 'incl19',
        atLeastOneGoodsReceipt: this.atLeastOneGoodsReceipt,
        sumedGoodsReceipt: this.sumedGoodsReceipt,
        sumedGoodsUmst: this.sumedGoodsUmst,
        goodsReceipt: this.goodsReceipt,
        otherAccountingEntries: this.otherAccountingEntries
      }
      var invoiceToUpdate = db.collection("invoices").doc(this.internalRef)
      invoiceToUpdate.set({
          data
      })
      .then(function() {
          console.log("Document successfully updated!");
      })
      .catch(error => {
          console.log(error)
      })
    },
    loadDraft() {
      var db = firebaseApp.firestore()
      var tempDrafts = []
      var vm = this
      db.collection('invoices').where('type', '==', 'SupplierInvoice').where('status', '==', 'Draft').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var data = {
              'draftid': doc.id,
              'invoiceNumber': doc.data().invoiceNumber,
              'supplierName': doc.data().supplierName,
              'systemdate': doc.data().bookingDate
            }
            tempDrafts.push(data)
          })
          vm.availabledrafts = tempDrafts
          vm.modalOpenDraft = true
      })
    },
    loadDataFromDraft(draftid) {
      var db = firebaseApp.firestore()
      var vm = this
      // get this id somehow
      db.collection('invoices').doc(draftid).get()
        .then(doc => {
            vm.internalRef = doc.id
            vm.invoiceUstNr = doc.data().invoiceUstNr
            vm.bookingDate = doc.data().bookingDate
            vm.invoiceNumber = doc.data().invoiceNumber
            vm.invoiceDate = doc.data().invoiceDate
            vm.selectedSupplier = doc.data().selectedSupplier
            vm.supplierName = doc.data().supplierName
            vm.usthandling = doc.data().usthandling
            vm.atLeastOneGoodsReceipt = doc.data().atLeastOneGoodsReceipt
            vm.sumedGoodsReceipt = doc.data().sumedGoodsReceipt
            vm.sumedGoodsUmst = doc.data().sumedGoodsUmst
            vm.goodsReceipt = doc.data().goodsReceipt
            vm.otherAccountingEntries = doc.data().otherAccountingEntries
          vm.modalOpenDraft = false
        })
    },
    saveInvoice(status) {
      if(this.invoiceNumber === null || this.invoiDate === null || this.supplierName === null) 
      {
        this.warningText = "Please fill in general invoice information first"
        this.modalWarning = true
      }else{
        if(this.internalRef === null) {
          this.saveFirstTime(status)
        }else{
          this.updateInvoice(status)
        }
      }
    },
    bookCost() {
      // this will save the invoice itsself
      this.saveInvoice("Booked")

      // store goods received to stock
      // determine average costs and quantity
      this.goodsReceipt.forEach(item => {
        this.addOneGoodsReceipt(item.barcode, item.name, item.amount, item.quantity)
      })
      
      // store accounting entries
      var tempAllAccountingEntries = []
      tempAllAccountingEntries.push(this.otherAccountingEntries)
      tempAllAccountingEntries.push(this.sumedGoodsReceipt)
      tempAllAccountingEntries.push(this.sumedGoodsUmst)
      tempAllAccountingEntries.forEach(item => {
        // store one accouting entry
        this.addOneAccountEntry(item.type, item.amount, item.comment)
      })

      // close or at least disable this one
      this.viewMode = true
    },
    addOneAccountEntry(_type, _amount, _comment) {
      var db = firebaseApp.firestore()
      const data = {
        invoiceRef: this.internalRef,
        invoiceDate: this.invoiceDate,
        bookingDate: this.bookingDate,
        sign: -1,
        type: _type,
        comment: _comment,
        amount: _amount
      }
      db.collection("accoutingentries")
        .add(data)
        .then()
        .catch(error => {
          console.log(error)
        }) 
    },
    addOneGoodsReceipt(_barcode, _name, _amount, _quantity) {
      var db = firebaseApp.firestore()
      const data = {
        internalRef: this.internalRef,
        barcode: _barcode,
        name: _name,
        amount: _amount,
        quantity: _quantity
      }
      db.collection("stock")
        .add(data)
        .then()
        .catch(error => {
          console.log(error)
        }) 
    },
    changeSupplier() {
      var selectedId = this.selectedSupplier
      this.availableSuppliers.forEach(cursup => {
        if(cursup.sup_id == selectedId) {
          this.supplierName = cursup.sup_name
          this.invoiceUstNr = cursup.sup_ustnbr
        }
      })
    },
    pickFile () {
      this.$refs.invoice.click()
    },
    onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.fileName = files[0].name
				if(this.fileName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.fileUrl = fr.result
					this.fileFile = files[0] // this is an image file that can be sent to server...
				})
			} else {
				this.fileName = ''
				this.fileFile = ''
				this.fileUrl = ''
			}
    },
    uploadFile() {
      var curFile = this.file
      var curInternalRef = this.internalRef
      var curNumberOfPages = this.numberOfInvoicePages + 1
      var vm = this
      if (curFile != null) {
        var storageRef = firebaseApp.storage().ref();
        var storageSpace = "invoices/" + curInternalRef + "_" + curNumberOfPages
        var invoiceRef = storageRef.child(storageSpace)
        var uploadTask = invoiceRef.put(curFile)
        uploadTask.on('state_changed', function(snapshot){
          switch (snapshot.state) {
            case firebaseApp.storage.TaskState.PAUSED: // or 'paused'
            break
            case firebaseApp.storage.TaskState.RUNNING: // or 'running'
            break
          }
        }, function(error) {
          console.log(error)
        }, function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            vm.picsUrl.push(downloadURL);
            vm.picsReference.push(curInternalRef + "_" + curNumberOfPages)
            vm.numberOfInvoicePages = curNumberOfPages
            vm.file = null
          //  vm.updateProduct()
          })
        })
      }
    },
    abort() {
      this.$router.push('/')
    }
  }
}
</script>