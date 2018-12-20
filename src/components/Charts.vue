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
            <GChart
              type="PieChart"
              :data="pieChartData"
              :options="pieChartOptions"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        :key="3"
      >
        <v-card>
          <v-card-text>
            <v-data-table 
              :headers="headers"
              :items="productsTable"
              class="elevation-1"
              >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.intake_quantity }}</td>
                <td>{{ props.item.intake_amount }}</td>
                <td>{{ props.item.order_quantity }}</td>
                <td>{{ props.item.order_amount }}</td>
              </template>
            </v-data-table>
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
      ordersRaw: null,
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
      pieChartData: [
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
      ],
      pieChartOptions: {
          title: 'My Daily Activities'
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
      },
      productsTable: [],
      headers: [
        { text: 'Barcode', value: 'barcode' },
        { text: 'Name', value: 'name' },
        { text: 'Bought_Qty', value: 'intake_quantity' },
        { text: 'Bought_Amt', value: 'intake_amount' },
        { text: 'Sold_Qty', value: 'order_quantity' },
        { text: 'Sold_Amt', value: 'order_amount' }
      ],
    }
  },
  beforeUpdate ( ) {
    var prodDict = {}
    //this.chartData.push(['Month', 'Bought', 'Sold'])
    var db = firebaseApp.firestore()
    db.collection('products').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var strId = doc.id.toString()
        var newLine = []
        newLine.push(doc.data().category)
        newLine.push(doc.data().barcode)
        newLine.push(doc.data().name)
        prodDict[strId] = newLine
      })
    }) 

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
            var prodInfo = prodDict[doc.data().product_id]
            if(prodInfo[0] == undefined) {
              strCat = "Other"
            }else{
              strCat = prodInfo[0]
            }

            var entry = {
              'created': strDate,
              'quantity': Number(doc.data().quantity),
              'purchase_price': Number(doc.data().purchase_price),
              'prod_name': prodInfo[2],
              'prod_barcode': prodInfo[1],
              'prod_category': strCat
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
    
    this.ordersRaw = []
  }
}
</script>

