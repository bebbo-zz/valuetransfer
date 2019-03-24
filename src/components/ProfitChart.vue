<template>
  <div id="profitchart">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <GChart
            type="AreaChart"
            :data="chartData"
            :options="chartOptions"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
import _ from 'lodash'

export default {
  name: "profitchart",
  data() {
    return {
      chartData: [
        ['Month', 'Bought', 'Sold'],
        ['2014', 1000, 400]
      ],
      chartOptions: {
        chart: {
          title: 'Monthly Performance',
          subtitle: 'Profit per month',
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var allEntries = []
    db.collection('accoutingentries').get()
      .then(querySnapshot => {
        var bookingDate = null
        var sign = 0
        var amount = 0
     //   var type = null
        querySnapshot.forEach(doc => {
          console.log(doc.data().bookingDate)
          bookingDate = new Date(doc.data().bookingDate)
          sign = parseFloat(doc.data().sign)
          amount = parseFloat(doc.data().amount)
       //   type = doc.data().type
          var monthString = bookingDate.getFullYear() + '-' + bookingDate.getMonth()
          var data = {
            'month': monthString,
            'amount': sign * amount
          }
          allEntries.push(data)
        })
        var profitByMonth =
            _(allEntries)
            .groupBy('month')
            .map((objs, key) => ({
              'month': key,
              'profit': _.sumBy(objs, 'amount') }))
            .value()
        console.log("profit by month")
        console.log(profitByMonth)
        next(vm => {
          vm.chartData = profitByMonth
        })
      })
  }
}

</script>