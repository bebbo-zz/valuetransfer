<template>
  <div id="register">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="login card-panel grey lighten-4 black-text">
            <h3>{{$t('register')}}</h3>
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
                <v-btn @click="register" color="success">{{$t('register')}}</v-btn>
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
  name: 'register',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    register: function( e ) {
      console.log('register')
      firebaseApp.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          alert('Account created for ${user.email}')
          this.$router.go({path: this.$router.path})
        },
        err => {
          alert(err.message)
        })
      e.preventDefault()
    }
  }
}
</script>
