<template>
  <div id="stock">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <template v-for="(item, index) in stockItems">
              <v-list-tile
                :key="index"
                >
                <v-list-tile-action>
                  <!--v-icon color="indigo">add</v-icon-->
                  <v-icon color="indigo">remove</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }} - {{ item.quantity }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.averagecost }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < stockItems.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "stock",
  data() {
    return {
      stockItems: []
    }
  },
  beforeRouteEnter(to, from, next) {
    var db = firebaseApp.firestore()
    var tempStock = []
    db.collection('stock').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = {
            'id': doc.id,
            'name': doc.data().name,
            'averagecost': doc.data().averagecost,
            'quantity': doc.data().quantity
          }
          tempStock.push(data)
        })
        next(vm => {
          vm.stockItems = tempStock
        })
    })
  }
}
</script>

