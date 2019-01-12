<template>
  <div
    id="e3"
    style="max-width: 400px; margin: auto;"
    class="grey lighten-3"
  >
    <v-toolbar
      color="pink"
      dark
      style="margin-top: 40px;"
    >
      <v-toolbar-title>Login</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-toolbar>

    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            <v-text-field
                  v-bind:label="$t('email')"
                  v-model="email"
                >
                </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            <v-text-field
                  v-bind:label="$t('password')"
                  v-model="password"
                >
                </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            <v-btn @click="login" color="success">{{$t('login')}} <v-icon style="margin-left: 8px;">send</v-icon></v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit'
export default {
  name: 'login',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login: function( e ) {
      firebaseApp.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('You are logged in as ' + user.email)
          this.$router.go({path: this.$router.path})
        },
        err => {
          alert(err.message)
      });
      e.preventDefault()
    }
  }
};
</script>
