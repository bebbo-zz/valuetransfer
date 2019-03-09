import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfigDev'
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp
