import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, child, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA6qOMKrP8T-XCimYhtprsyquEDUc8gjMc",
  authDomain: "avancjutprojekt.firebaseapp.com",
  databaseURL: "https://avancjutprojekt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "avancjutprojekt",
  storageBucket: "avancjutprojekt.appspot.com",
  messagingSenderId: "4356398631",
  appId: "1:4356398631:web:056ff906811887d36fb802"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set, push, child, update, remove };