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
            item-value="sup_ustnbr"
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
                <div>{{ sumedGoodsReceipt.type }} - {{ sumedGoodsReceipt.amount }}</div>
              </template>
                      <v-card>
                        <!-- und hier muss dann eine liste hin -->
                        <v-card-text>Loadipi sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
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
                  <v-list-tile-title>{{ sumedGoodsUmst.type }} - {{ sumedGoodsUmst.amount }}</v-list-tile-title>
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
                  <v-list-tile-title>{{ item.type }} - {{ item.amount }}</v-list-tile-title>
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
            <v-btn @click.native="saveAsDraft" slot="activator" color="warning" large>{{$t('saveasdraft')}}</v-btn> 
            <span>{{$t('save')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click.native="bookInvoice" slot="activator" color="success" large>{{$t('bookinvoice')}}</v-btn> 
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
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('newCostItem')}}</span>
        </v-card-title>
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
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs5 offset-xs1>
                        <v-text-field
                          v-bind:label="$t('costamount')"
                          v-model="newin_amount"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-bind:label="$t('name')"
                          v-model="newin_name"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-tooltip top>
                          <v-btn @click.native="saveGoodReceipt" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
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
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-dialog>
<!-- END Modal Add Item -->

  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "newcost",
  data() {
    return {
      modalAddCostItem: false,
      active_tab: 1,
      costtypes: [],
      availableSuppliers: [],
      newin_costtype: null,
      newin_costamount: null,
      newin_costcomment: null,
      newin_barcode: null,
      newin_name: null,
      newin_amount: null,
      invoiceUstNr: null,
      file: null,
      fileName: null,
      fileUrl: null,
      fileFile: null,
      numberOfInvoicePages: 0,
      internalRef: null,
      bookingDate: new Date().toISOString().substr(0, 10),
      modal: false,
      invoiceNumber: null,
      invoiceDate: new Date().toISOString().substr(0, 10),
      selectedSupplier: null,
      usthandling: 'incl19',
      atLeastOneGoodsReceipt: false,
      sumedGoodsReceipt: {
        type: 'Wareneinkauf',
        amount: 0,
        comment: 'Sum of Goods Receipt'
      },
      sumedGoodsUmst: {
        type: 'Umsatzsteuer',
        amount: 0,
        comment: 'Sum of Umsatzsteuer'
      },
      goodsReceipt: [],
      otherAccountingEntries: []
      // type, amount, comment (MwSt always separate)
      // when enter amount select if gross or net
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempSuppliers = []
    db.collection('businesspartners').where('type', '==', 'Supplier').get()
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
    addCostItem() {
      this.active_tab = 1
      this.modalAddCostItem = true
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
    saveGoodReceipt() {
      var data = {
        'barcode': this.newin_barcode,
        'amount': this.newin_amount,
        'name': this.newin_name,
      }
      this.goodsReceipt.push(data)
      this.atLeastOneGoodsReceipt = true
      
      this.sumedGoodsReceipt.amount = this.sumedGoodsReceipt.amount + (this.newin_amount * 0.81)
      this.sumedGoodsUmst.amount = this.sumedGoodsUmst.amount + (this.newin_amount * 0.19)
      
      this.closeDialog()
    },
    closeDialog() {
      this.newin_barcode = null
      this.newin_name = null
      this.newin_amount = null
      this.newin_costtype = null
      this.newin_costamount = null
      this.newin_costcomment = null
      this.modalAddCostItem = false
    },
    editCostItem (index) {
      var data = this.otherAccountingEntries[index]
      console.log(data)
      this.newin_costtype = data.type
      this.newin_costamount = data.amount
      this.newin_costcomment = data.comment
      this.modalAddCostItem = true
    },
    saveFirstTime() {
      var db = firebaseApp.firestore()
      var tempAllAccountingEntries = this.otherAccountingEntries
      if(this.atLeastOneGoodsReceipt) {
        tempAllAccountingEntries.push(this.sumedGoodsReceipt)
        tempAllAccountingEntries.push(this.sumedGoodsUmst)
      }
      const data = {
        bookingDate: new Date(),
        invoiceNumber: this.invoiceNumber,
        invoiceDate: this.invoiceDate,
        invoiceSupplier: this.selectedSupplier.sup_name,
        invoiceUstNr: this.selectedSupplier.sup_ustnbr,
        invoiceEntries: tempAllAccountingEntries
      }
      console.log(data)
      var vm = this
      db.collection("costinvoice")
        .add(data)
        .then(docRef => {
          vm.internalRef = docRef.id
          vm.bookingDate = new Date()
        })
        .catch(error => {
          console.log(error)
        })  
    },
    saveAsDraft() {
      if(this.internalRef === null) {
        this.saveFirstTime()
      }else{
        this.updateDraft()
      }
    },
    bookCost() {
      if(this.internalRef === null) {
        this.saveFirstTime()
      }
      /*if(this.file === null) {
        console.log("you cannot book without receipt")
      }
      
      // book the invoice
      var data = {
            'internalRef': doc.id,
            'invoiceNumber': doc.data().invoiceNumber,
            'bookingDate': doc.data().bookingDate,
            'supplier': doc.data().supplier,
            'totalBookedAmount': doc.data().totalBookedAmount
          }
      
      // store goods received to stock
      */

    },
    changeSupplier(a) {
      this.invoiceUstNr = a.sup_ustnbr
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