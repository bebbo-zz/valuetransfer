<template>
  <div id="businesspartner">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('businesspartner')}}</v-subheader>
          <v-list two-line>
            <template v-for="(item, index) in businesspartners">
              <v-list-tile
                :key="index"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">perm_identity</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.type }} - {{ item.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.address }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < businesspartners.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
      <v-btn
            color="pink"
            dark
            fixed
            bottom
            right
            fab
            @click='addBusinessPartner'
          >
            <v-icon>add</v-icon>
          </v-btn>
    </v-container>
    <!-- Modal Component -->
    <v-dialog 
      v-model="modalAddBusinessPartner"
      persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('newbusinesspartner')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex xs5>
                <v-text-field
                  v-bind:label="$t('name')"
                  v-model="newin_name"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs5 offset-xs1>
                <v-text-field
                  v-bind:label="$t('ustnr')"
                  v-model="newin_ustnummer"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs5>
                <v-text-field
                  v-bind:label="$t('address')"
                  v-model="newin_address"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs5 offset-xs1>
                <v-select
                  :items="bptypes"
                  box
                  v-bind:label="$t('bptype')"
                  v-model="newin_type" 
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-tooltip top>
                  <v-btn @click.native="saveBusinessPartner" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
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
  name: "businesspartner",
  data() {
    return {
      modalAddBusinessPartner: false,
      newin_type: null,
      newin_name: null,
      newin_ustnummer: null,
      newin_address: null,
      bptypes: ['Supplier', 'Customer'],
      businesspartners: []
      // name, umstnummer, address
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempBp = []
    console.log("here")
    db.collection('businesspartner').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'id': doc.id,
            'name': doc.data().name,
            'ustnbr': doc.data().ustnbr,
            'address': doc.data().address,
            'type': doc.data().type
          }
          tempBp.push(data)
        })
        next(vm => {
          vm.businesspartners = tempBp
        })
    })
  },
  methods: {
    addBusinessPartner() {
      this.modalAddBusinessPartner = true
    },
    saveBusinessPartner() {
      var db = firebaseApp.firestore()

      const data = {
        name: this.newin_name,
        ustnbr: this.newin_ustnummer,
        address: this.newin_address,
        type: this.newin_type
      }
      console.log(data)
      db.collection("businesspartner")
        .add(data)
        .then(this.closeDialog())
        .catch(error => {
          console.log(error)
        })  
    },
    closeDialog() {
      this.newin_name = null
      this.newin_ustnummer = null
      this.newin_address = null
      this.newin_type = null
      this.modalAddBusinessPartner = false
    }
  }
}
</script>

