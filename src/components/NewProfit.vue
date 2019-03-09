<template>
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
                  <v-btn @click.native="saveProfitItem" slot="activator" color="success" large>{{$t('save')}}</v-btn> 
                  <span>{{$t('save')}}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn @click.native="abort" slot="activator" color="error" large>{{$t('cancel')}}</v-btn>    
                  <span>{{$t('cancel')}}</span>
                </v-tooltip>
              </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebaseApp from './firebaseInit'

export default {
  name: "newprofit",
  data() {
    return {
      type: null,
      ammount: null,
      profittypes: [],
      availableInvoices: [],
      paymentDate: null,
      comment: null
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempInvoices = []
    db.collection('profitinvoice').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'ref_id': doc.id,
            'ref_date': doc.data().created,
            'ref_amount': doc.data().totalamount,
            'ref_customer': doc.data().customer
          }
          tempInvoices.push(data)
        })
        next(vm => {
          vm.availableInvoices = tempInvoices
        })
    })
  },
  methods: {
    saveProfitItem() {

    },
    abort() {
      this.$router.push('/')
    }
  }
}
</script>
