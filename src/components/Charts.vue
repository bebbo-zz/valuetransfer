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
        <br />
        <v-card>
          <v-card-text>
            <GChart
              type="PieChart"
              :data="samplePieChartData"
              :options="samplePieChartOptions"
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
                <td>{{ props.item.intake_qty }}</td>
                <td>{{ props.item.intake_amt }}</td>
                <td>{{ props.item.order_qty }}</td>
                <td>{{ props.item.order_amt }}</td>
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
        ['2014', 1000, 400]
      ],
      chartOptions: {
        chart: {
          title: 'Monthly Performance',
          subtitle: 'Orders, Intakes per month',
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
          title: 'Sample Area Chart',
          subtitle: 'Sample as Reference',
        }
      },
      pieChartData: [
          ['Task', 'Hours per Day'],
          ['Work',     11]
      ],
      pieChartOptions: {
          title: 'Orders by Category'
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
          title: 'Sample Pie Chart'
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
    var intakesByBarcode = null
    var ordersByBarcode = null
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
              prodInfo = prodDict[doc.data().product_id]
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

          intakesByBarcode =
          _(intakesRaw)
            .groupBy('prod_barcode')
            .map((objs, key) => ({
                'barcode': key,
                'intake_qty': _.sumBy(objs, 'quantity'),
                'intake_amt': _.sumBy(objs, 'amount') }))
            .value()
        })

       db.collection('orders').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
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

            ordersByBarcode =
            _(ordersRaw)
              .groupBy('prod_barcode')
              .map((objs, key) => ({
                  'barcode': key,
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
          tempChartData.push(['Month', 'Intake_Amt', 'Order_Amt'])
          tempChartData = _.union(tempChartData, Object.values(monthDict))
          this.chartData = tempChartData

          // pie chart
          tempChartData = []
          tempChartData.push(['Category', 'Quantity'])
          ordersByCategoryResult.forEach(res => {
            var newLine = []
            newLine.push(res.prod_category)
            newLine.push(res.order_qty)
            tempChartData.push(newLine)
          })
          this.pieChartData = tempChartData

          // table of items
          
          // we join orders and intakes to one array
          var found = false
          var joinedAmtQty = []
          ordersByBarcode.forEach(orderJson => {
            var joinedEntry = orderJson
            var orderCode = orderJson['barcode']
            found = false
            var indexToRemove = 0
            for (let i = 0; i < intakesByBarcode.length; i++) {
              var intakeJson = intakesByBarcode[i]
              
              if (intakeJson['barcode'] == orderCode) {
                found = true
                joinedEntry['intake_qty'] = intakeJson['intakes_qty']
                joinedEntry['intake_amt'] = intakeJson['intakes_amt']
                indexToRemove = i
                break
              }
            }
            
            if(found == false) {
              joinedEntry['intake_qty'] = 0
              joinedEntry['intake_amt'] = 0
            }else{
              intakesByBarcode.splice(indexToRemove, 1)
            }
            joinedAmtQty.push(joinedEntry)
          })

          intakesByBarcode.forEach(intakeJson => {
            var joinedEntry = intakeJson
            joinedEntry['order_qty'] = 0
            joinedEntry['order_amt'] = 0
            joinedAmtQty.push(joinedEntry)
          })

          joinedAmtQty.forEach(amtQtyJson => {
            var completeJson = amtQtyJson
            if(prodDict[amtQtyJson['barcode']] == undefined) {
              completeJson['category'] = 'Other'
              completeJson['name'] = 'Unknown'
            }else{
              var curProdArray = prodDict[amtQtyJson['barcode']]
              completeJson['category'] = curProdArray[0]
              completeJson['name'] = curProdArray[2]
            }
            console.log(completeJson)
            this.productsTable.push(completeJson)
          })
        }).catch(function(error) {
          console.log(error)
        })  
    }).catch(function(error) {
      console.log(error)
    })    
  }
}
</script>

