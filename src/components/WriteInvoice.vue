<template>
  <div id="writeinvoice">
    <v-container v-if="step === 1">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectcustomer')}}</v-subheader>
          
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
    <v-container v-if="step === 2">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectitems')}}</v-subheader>
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
    <v-container v-if="step === 3">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>{{$t('selectfee')}}</v-subheader>
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
  </div>
</template>

<script>
export default {
  name: "writeinvoice",
  data() {
    return {
      step: 1
    }
  },
  methods: {
    back() {
      this.step = this.step - 1
    },
    next() {
      this.step = this.step + 1
    }
  }
}
</script>

