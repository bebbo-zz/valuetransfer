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
    //  intakesRaw: [],
      ordersRaw: [],
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
      samplePieChartData: [
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
      ],
      samplePieChartOptions: {
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
  beforeMount ( ) {
    var prodDict = {}
    var intakesRaw = []
    var ordersRaw = []
    var intakesByMonthResult = null
    var ordersByMonthResult = null
    var ordersByCategoryResult = null
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
            var strBarcode = ""
            var strName = ""
            var prodInfo = null
            if(prodInfo == undefined || doc.data().product_id == undefined) {
              strCat = "Other"
              strName = "Other"
              strBarcode = "Other"
            }else{
              prodInfo = prodDict[strCat]
              if(prodInfo[0] == undefined) {
                strCat = "Other"
              }else{
                strCat = prodInfo[0]
              }
              if(prodInfo[2] == undefined) {
                strName = "Other"
              }else{
                strName = prodInfo[2]
              }
              if(prodInfo[1] == undefined) {
                strBarcode = "Other"
              }else{
                strBarcode = prodInfo[1]
              }
            }
            var tempQuantity = Number(doc.data().quantity)
            var tempAmount = tempQuantity * Number(doc.data().purchase_price)
            const intakeentry = {
              'created': strDate,
              'quantity': tempQuantity,
              'amount': tempAmount,
              'prod_name': strName,
              'prod_barcode': strBarcode,
              'prod_category': strCat
            } 
        //    console.log(entry)
            intakesRaw.push(intakeentry)
          })
       
         intakesByMonthResult =
          _(intakesRaw)
            .groupBy('created')
            .map((objs, key) => ({
                'created': key,
                'intakes_qty': _.sumBy(objs, 'quantity'),
                'intakes_amt': _.sumBy(objs, 'amount') }))
            .value()
        })

       db.collection('orders').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.data())
            var strDate = ""
            if(doc.data().receiptDate == undefined) {
              strDate = "2018-10"
            }else{
              var mm = doc.data().receiptDate.getMonth() + 1 // getMonth() is zero-based
              strDate = [doc.data().receiptDate.getFullYear(),
                      (mm>9 ? '' : '0') + mm
                    ].join('-');
            }

            var tempProducts = doc.data().products
            tempProducts.forEach(item => {
              const orderentry = {
                'created': strDate,
                'quantity': Number(item.quantity),
                'amount': Number(item.price),
                'prod_name': item.name,
                'prod_barcode': item.barcode,
                'prod_category': item.category
              }
              ordersRaw.push(orderentry)
            })
            ordersByMonthResult =
            _(ordersRaw)
              .groupBy('created')
              .map((objs, key) => ({
                  'created': key,
                  'order_qty': _.sumBy(objs, 'quantity'),
                  'order_amt': _.sumBy(objs, 'amount') }))
              .value()

            ordersByCategoryResult =
            _(ordersRaw)
              .groupBy('prod_category')
              .map((objs, key) => ({
                  'prod_category': key,
                  'order_qty': _.sumBy(objs, 'quantity'),
                  'order_amt': _.sumBy(objs, 'amount') }))
              .value()
          })

          var tempChartData = []
          var monthDict = {}

          // here not so much error handling anymore
          // all undefined and stuff should be caught before

          // line chart
          intakesByMonthResult.forEach(res => {
            var newLine = []
            var strCreated = res.created
            newLine.push(res.created)
            newLine.push(res.intakes_amt)
            newLine.push(0)
            monthDict[strCreated] = newLine
          })
          ordersByMonthResult.forEach(res => {
            var strCreated = res.created
            if(monthDict[strCreated] == undefined) {
              var newLine = []
              newLine.push(res.created)
              newLine.push(0)
              newLine.push(res.intakes_amt)
              monthDict[strCreated] = newLine
            }else{
              monthDict[strCreated][2] = res.order_amt
            }
          })
          console.log(monthDict)
          tempChartData.push(['Month', 'Intake_Amt', 'Order_Amt'])
          tempChartData = _.union(tempChartData, monthDict.values)
          console.log(tempChartData)
      // this.chartData = tempChartData

          // pie chart
          tempChartData = []
          tempChartData.push(['Category', 'Quantity'])
          ordersByCategoryResult.forEach(res => {
            var newLine = []
            newLine.push(res.prod_category)
            newLine.push(res.order_qty)
            tempChartData.push(newLine)
          })
    //  this.pieChartData = tempChartData

    
        }).catch(function(error) {
          console.log(error)
        })  
    }).catch(function(error) {
      console.log(error)
    })    
  }
}
</script>

