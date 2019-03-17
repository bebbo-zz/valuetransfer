<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
                        <div v-if="one_visible === true">
                          <v-text-field
                            v-model="one_paidDisplay"
                            v-bind:label="$t('costamount')"
                            @blur="onBlurNumber"
                            type="text"
                            prefix="€"
                          >
                          </v-text-field>
                        </div>
                        <div v-if="one_visible === false">
                          <v-text-field
                            v-model="one_paidDisplay"
                            v-bind:label="$t('costamount')"
                            @focus="onFocusText"
                            type="text"
                            prefix="€"
                          >
                          </v-text-field>
                        </div>
                        <!--v-text-field
                          v-bind:label="$t('costamount')"
                          v-model="newin_amount"
                        >
                        </v-text-field-->
                      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'mobilecashier',
    data: () => ({
      one_visible: true,
      one_moneyPaid: 0,
      one_paidDisplay: null
    }),
  methods: {
    onBlurNumber(e) {
      console.log(e)
      this.one_visible = false
      this.one_moneyPaid = this.convertToNumber(this.one_paidDisplay)
      this.one_paidDisplay = this.formatAmount(this.one_paidDisplay)
    },
    onFocusText() {
      this.one_visible = true
      this.one_paidDisplay = this.one_moneyPaid
    },
    formatAmount(amount) {
      //console.log(amount)
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        amount = amount.replace(",", ".")
        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2)
        amount = amount.replace(".", ",")
        return amount
      } else {
        return amount
      }
    },
    convertToNumber(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        amount = amount.replace(",", ".")
        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2)
        return amount
      } else {
        return amount
      }
    }
  }
}
</script>
