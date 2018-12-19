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
export default {
  name: 'charts',
  data () {
    return {
      tabs: null,
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
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      }
    }
  }
}
</script>

