<template>
  <div id="login">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="login card-panel green white-text center">
            <h3>{{$t('login')}}</h3>
              <v-form>
                <v-icon>email</v-icon>
                <v-text-field
                  v-bind:label="$t('email')"
                  v-model="email"
                >
                </v-text-field>
                <v-icon>lock</v-icon>
                <v-text-field
                  v-bind:label="$t('password')"
                  v-model="password"
                >
                </v-text-field>
                <v-btn @click="login" color="success">{{$t('login')}}</v-btn>
            </v-form>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
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
      console.log('register')
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
