<template>
  <div>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>POS</span>
        <span class="font-weight-light">HANG DUC</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">LOGIN</span>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="home">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="cashier">
          <v-list-tile-action>
            <v-icon>add_to_queue</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cashier</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">Categories</div>
          <v-list dense>
            <v-list-tile v-for="cat in categories" v-bind:key="cat" @click="catOne(cat)">
              <v-list-tile-action>
                <v-icon>link</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{cat}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavbarTop',
  data () {
    return {
      drawer: null,
      categories: ["Ăn dặm",
        "bách hoá",
        "Chăm sóc sức khoẻ cho trẻ em",
        "đồ chơi",
        "Đồ dùng gia đình",
        "Đồ dùng nhà bếp",
        "Làm đẹp- súc khoẻ",
        "Làm đẹp- sức khoẻ",
        "thời trang nam",
        "thời trang nữ",
        "thời trang trẻ em",
        "thời trang unisex",
        "Vệ sinh phụ nữ"]
    }
  },
  methods: {
    home: function( e ) {
      console.log('home')
      this.$router.push('/')
      e.preventDefault()
    },
    cashier: function( e ) {
      console.log('cashier')
      this.$router.push('/cashier')
      e.preventDefault()
    }
  }
}
</script>