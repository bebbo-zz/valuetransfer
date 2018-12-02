<template>
  <v-container>
    <v-radio-group 
      id="paymentmethod" 
      v-model="selected" 
      name="radioSubComponent">
      <v-radio value="cash"><img src="@/assets/icons/cash.png" /></v-radio>
      <v-radio value="bankcard"><img src="@/assets/icons/bank_card.png" /></v-radio>
      <v-radio value="creditcard"><img src="@/assets/icons/credit_card.png" /></v-radio>
      <v-radio value="paypal"><img src="@/assets/icons/paypal.png" /></v-radio>
    </v-radio-group>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'checkout',
  data () {
    return {
      selected: 'cash'
    }
  }
}
</script>
    