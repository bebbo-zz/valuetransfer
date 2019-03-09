<template>
  <div id="newcost">
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
          <v-text-field
            v-bind:label="$t('invoiceDate')"
            v-model="invoiceDate"
          >
          </v-text-field>
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
          <v-text-field
            v-bind:label="$t('invoiceSupplier')"
            v-model="invoiceSupplier"
          >
          </v-text-field>
        </v-flex>
        <v-flex xs5 offset-xs1>
          <v-text-field
            v-bind:label="$t('invoiceUstNr')"
            v-model="invoiceUstNr"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
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
          <v-subheader>{{$t('invoiceitems')}}</v-subheader>
          <v-list two-line>
            <template v-for="(item, index) in invoiceEntries">
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
                v-if="index + 1 < invoiceEntries.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
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
    <!-- Modal Component -->
    <v-dialog 
      v-model="modalAddCostItem"
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('newCostItem')}}</span>
        </v-card-title>
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
    </v-dialog>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "newcost",
  data() {
    return {
      modalAddCostItem: false,
      costtypes: [],
      newin_costtype: null,
      newin_costamount: null,
      newin_costcomment: null,
      file: null,
      fileName: null,
      fileUrl: null,
      fileFile: null,
      numberOfInvoicePages: 0,
      internalRef: null,
      bookingDate: null,
      invoiceNumber: null,
      invoiceDate: null,
      invoiceSupplier: null,
      invoiceUstNr: null,
      invoiceEntries: []
      // type, amount, comment (MwSt always separate)
      // when enter amount select if gross or net
    }
  },
  beforeMount ( ) {
    console.log(process.env.VUE_APP_COSTTYPES)
    this.costtypes = process.env.VUE_APP_COSTTYPES.split(',')
  },
  methods: {
    addCostItem() {
      this.modalAddCostItem = true
    },
    saveCostItem() {
      var data = {
        'type': this.newin_costtype,
        'amount': this.newin_costamount,
        'comment': this.newin_costcomment,
      }
      this.invoiceEntries.push(data)
      this.closeDialog()
    },
    closeDialog() {
      this.newin_costtype = null
      this.newin_costamount = null
      this.newin_costcomment = null
      this.modalAddCostItem = false
    },
    editCostItem (index) {
      var data = this.invoiceEntries[index]
      console.log(data)
      this.newin_costtype = data.type
      this.newin_costamount = data.amount
      this.newin_costcomment = data.comment
      this.modalAddCostItem = true
    },
    saveFirstTime() {
      var db = firebaseApp.firestore()
      const data = {
        bookingDate: new Date(),
        invoiceNumber: this.invoiceNumber,
        invoiceDate: this.invoiceDate,
        invoiceSupplier: this.invoiceSupplier,
        invoiceUstNr: this.invoiceUstNr,
        invoiceEntries: this.invoiceEntries
      }
      console.log(data)
      var vm = this
      db.collection("costinvoice")
        .add(data)
        .then(docRef => {
          vm.internalRef = docRef.id
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
      if(this.file === null) {
        console.log("you cannot book without receipt")
      }
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