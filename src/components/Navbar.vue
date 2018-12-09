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
        color="success"
        @click="register"
      >
        <span class="mr-2">REGISTER</span>
      </v-btn>
      <v-btn
        flat
        @click="login"
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
         <v-list-tile @click="selling">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Products</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">Categories</div>
          <v-list dense>
            <v-list-tile v-for="cat in categories" v-bind:key="cat.value" @click="category(cat.value)">
              <v-list-tile-action>
                <v-icon>link</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{cat.text}}</v-list-tile-title>
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
      categories: [{"text": "Ăn dặm", "value": 1},
          {"text": "bách hoá", "value": 2},
          {"text": "Chăm sóc sức khoẻ cho trẻ em", "value": 3},
          {"text": "đồ chơi", "value": 4},
          {"text": "Đồ dùng gia đình", "value": 5},
          {"text": "Đồ dùng nhà bếp", "value": 6},
          {"text": "Làm đẹp- súc khoẻ", "value": 7},
          {"text": "Làm đẹp- sức khoẻ", "value": 8},
          {"text": "thời trang nam", "value": 9},
          {"text": "thời trang nữ", "value": 10},
          {"text": "thời trang trẻ em", "value": 11},
          {"text": "thời trang unisex", "value": 12},
          {"text": "Vệ sinh phụ nữ", "value": 13}
      ]
    }
  },
  methods: {
    home: function( e ) {
      this.$router.push('/')
      e.preventDefault()
    },
    cashier: function( e ) {
      this.$router.push('/cashier')
      e.preventDefault()
    },
    selling: function( e ) {
      this.$router.push('/display')
      e.preventDefault()
    },
    login: function( e ) {
      this.$router.push('/login')
      e.preventDefault()
    },
    register: function( e ) {
      this.$router.push('/register')
      e.preventDefault()
    },
    category ( value ) {
      this.$router.push('/categories/' + value)
      e.preventDefault()
    }
  }
}
</script>