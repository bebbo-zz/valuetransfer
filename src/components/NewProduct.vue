<template>
  <div id="new-product">
    <h3>New Product</h3>
    <div class="row">
      <form @submit.prevent="saveProduct" class="col s12">
        <div class="row">
          <div class="input-field col s6">
            <input type="text" v-model="barcode" required>
            <label>Barcode</label>
          </div>
          <div class="input-field col s6">
            <input type="text" v-model="article_number" required>
            <label>Article Number</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="name_ger" required>
            <label>Name (German)</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="name" required>
            <label>Name (Display)</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <input type="text" v-model="price" required>
            <label>Price</label>
          </div>
          <div class="input-field col s6">
            <input type="text" v-model="category" required>
            <label>Category</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="description" required>
            <label>Description</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <b-form-file @change="fileSelected" v-model="file" :state="Boolean(file)" accept="image/jpeg, image/png, image/gif" placeholder="Choose a file..."></b-form-file>
          </div>
        </div>
        <button type="submit" class="btn"><i class="fa fa-save"></i></button>
        <router-link to="/" class="btn grey"><i class="fa fa-ban"></i></router-link>
      </form>
    </div>
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
      description: null,
      name: null,
      name_ger: null,
      price: null,
      size: null,
      tags: null,
      file: null
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
    }
  },
  fileSelected(event) {
    this.file = event.target.files[0];
  }
};
</script>