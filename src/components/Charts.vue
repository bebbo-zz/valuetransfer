<template>
  <div>
    <v-toolbar
      color="purple"
      dark
      tabs
    >
      <v-tabs
        slot="extension"
        v-model="tabs"
        centered
        color="transparent"
        slider-color="white"
      >
        <v-tab
          :key="1"
        >
          Profit Development
        </v-tab>
         <v-tab
          :key="2"
        >
          Category Performance
        </v-tab>
         <v-tab
          :key="3"
        >
          Top Items
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item
        :key="1"
      >
        <v-card>
          <v-card-text>
            <GChart
              type="AreaChart"
              :data="chartData"
              :options="chartOptions"
            />
          </v-card-text>
        </v-card>
        <br />
        <v-card>
          <v-card-text>
            <GChart
              type="AreaChart"
              :data="sampleChartData"
              :options="sampleChartOptions"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        :key="2"
      >
        <v-card>
          <v-card-text>
            Some text 2
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        :key="3"
      >
        <v-card>
          <v-card-text>
            Some text 3
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
import _ from 'lodash';

export default {
  name: 'charts',
  data () {
    return {
      tabs: null,
      intakesRaw: null,
      chartData: [
        ['Month', 'Bought', 'Sold'],
        ['2014', 1000, 400],
        ['2015', 1170, 460],
        ['2016', 660, 1120],
        ['2017', 1030, 540]
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses 2014-2017',
        }
      },
      sampleChartData: [
        ['Month', 'Bought', 'Sold'],
        ['2014', 1000, 400],
        ['2015', 1170, 460],
        ['2016', 660, 1120],
        ['2017', 1030, 540]
      ],
      sampleChartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses 2014-2017',
        }
      }
    }
  },
  beforeUpdate ( ) {
    this.intakesRaw = []
    var catDict = {}
    //this.chartData.push(['Month', 'Bought', 'Sold'])
    var db = firebaseApp.firestore()
    db.collection('products').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var strId = doc.id.toString()
        catDict[strId] = doc.data().category
      })
    }) 

    var newLine = []
    this.intakesRaw = []
    db.collection('intakes').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var strDate = ""
            if(doc.data().created == undefined) {
              strDate = "2018-10"
            }else{
              var mm = doc.data().created.getMonth() + 1 // getMonth() is zero-based
              strDate = [doc.data().created.getFullYear(),
                      (mm>9 ? '' : '0') + mm
                    ].join('-');
            }
            var strCat = ""
            if(catDict[doc.data().product_id] == undefined) {
              strCat = "Other"
            }else{
              strCat = catDict[doc.data().product_id]
            }

            var entry = {
              'created': strDate,
              'quantity': Number(doc.data().quantity),
              'purchase_price': Number(doc.data().purchase_price),
              'category': strCat
            }
          
         //   newLine.push(strCat)
            this.intakesRaw.push(entry)
            
            // var groupedData = _.groupBy(data, function(d){return d.division});
            // but this works on JSON
          })
          console.log(this.intakesRaw)
          var groupedData = _.groupBy(this.intakesRaw, function(d){return d.created})
          console.log(groupedData)
      })
    
  }
}
</script>

