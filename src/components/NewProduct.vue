<template>
  <div id="new-product">
    <v-container>
      <v-layout row wrap>
        <h3>{{$t('newproduct')}}</h3>
      </v-layout>
      <v-layout row wrap>
         <v-flex xs6>
          <v-text-field
            v-bind:label="$t('barcode')"
            v-model="barcode"
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-bind:label="$t('articlenumber')"
            v-model="article_number"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-bind:label="$t('namegerman')"
            v-model="name_ger"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-bind:label="$t('namedisplay')"
            v-model="name"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <!-- @submit.prevent="updateProduct" -->
        <v-flex xs6>
          <v-text-field
            v-bind:label="$t('price')"
            v-model="price"
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-bind:label="$t('category')"
            v-model="category"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-divider></v-divider>
          <v-tooltip top>
            <v-btn @click="saveProduct" slot="activator"><v-icon>save</v-icon></v-btn>
            <span>{{$t('save')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn @click="abort" slot="activator"><v-icon>highlight_off</v-icon></v-btn>
            <span>{{$t('cancel')}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// import db from './firebaseInit'
import firebaseApp from "./firebaseInit";

export default {
  name: "new-product",
  data() {
    return {
      product_id: null,
      article_number: null,
      barcode: null,
      category: null,
      colour: null,
      name: null,
      name_ger: null,
      price: null,
      size: null,
      tags: null
    };
  },
  methods: {
    saveProduct() {
      var db = firebaseApp.firestore();

      db.collection("products")
        .add({
          article_number: this.article_number,
          barcode: this.barcode,
          category: this.category,
          colour: this.colour,
          description: this.description,
          name: this.name,
          name_ger: this.name_ger,
          price: this.price,
          size: this.size
        })
        .then(docRef => {
          var curFile = this.file;
          var curProductID = docRef.id;
          firebaseApp
            .auth()
            .signInAnonymously()
            .then(function() {
              if (curFile != null) {
                var storageRef = firebaseApp.storage().ref();
                var storageSpace = "images/" + curProductID + "_0";
                var imageRef = storageRef.child(storageSpace);

                var uploadTask = imageRef.put(curFile);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on(
                  "state_changed",
                  function(snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                      case firebaseApp.storage.TaskState.PAUSED: // or 'paused'
                        console.log("Upload is paused");
                        break;
                      case firebaseApp.storage.TaskState.RUNNING: // or 'running'
                        console.log("Upload is running");
                        break;
                    }
                  },
                  function(error) {
                    // Handle unsuccessful uploads
                    console.log(error);
                  },
                  function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    // uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    //     console.log('File available at', downloadURL);
                    // })
                    // hier sollte das images ebenfalls in die Datenbank geschrieben werden
                  }
                );
              }
            });
          this.$router.push("/");
        })
        .catch(error => {
          console.log(err);
        });
    },
    abort() {
      this.$router.push('/')
    }
  }
};
</script>