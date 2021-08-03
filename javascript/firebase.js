
// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
    apiKey: "AIzaSyBLFL-v7y--CWxeAyGpu26DKhec6FrQIHQ",
    authDomain: "thechatroom-kez.firebaseapp.com",
    projectId: "thechatroom-kez",
    storageBucket: "thechatroom-kez.appspot.com",
    messagingSenderId: "1061808381496",
    appId: "1:1061808381496:web:a3ebdcff178b8af02f10cd",
    measurementId: "G-HDE3XKX7G1"
 };

// Initialize Firebase

firebase.initializeApp(firebaseConfig);


// Initialize Firebase Database and ready for exportation

export var db = firebase.firestore();

// Initialize Firebase Auth UI and ready for exportation

export var ui = new firebaseui.auth.AuthUI(firebase.auth());

