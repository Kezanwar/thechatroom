// ------------------ Import Functions and Database Object -----------------

import sidebarFunctionality from "./components/sidebar.js"
import { sendMessageToDOM, sendErrorMsg} from "./components/message.js"
import { colorPickerInput, colorPickerToUI, hexToRGB } from "./components/colorPicker.js"

// Import initialized Database from Firebase

import { db } from "./firebase.js"


// ---------------------- DOM Elements ---------------------------


const msgButton = document.getElementById('messageBtn');
const msgInput = document.getElementById('messageInput');
const msgBox = document.getElementById('messageBox');
const colorPicker = document.getElementById('favcolor');
const logoutBtn = document.getElementById('logout');
const mainWrapper = document.getElementById('mainWrapper');
const loadingSection = document.getElementById('loading__section');
const uiDisplayName = document.getElementById('displayName');
const header = document.getElementById('header');
const welcomeMessageName = document.getElementById('firstName');
const usersOnlineCount = document.getElementById('userCount');
const userOnlineContainer = document.getElementById('userOnlineBox');


// -------------------- User Inistialization ------------------------------


function sendIsOnline(userID) {
  
  const isOnline = db.collection('users');

  isOnline.doc(userID).update({
    isOnline: true,
  });

};
 

// Listening for authentication state change, if user is signed in....
// If user is signed out....

firebase.auth().onAuthStateChanged((user) => {
  
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    sendIsOnline(uid);
    asyncInitializeUser(uid);
  }  
   else {
    // User is signed out
    // Send to login page
    window.location.href = "http://127.0.0.1:5500/login.html"
  }
});

// initializing user function returning a promise with the userID passed in as argument. Promise checks if the user is registered or not in the database, initalizes the UI accordingly... (called in the above listening to auth change function) 


function initializeUser(userID) {
  return new Promise((resolve, reject) => {
    
    const users = db.collection('users');
    const userDoc = users.doc(userID);
    const currentUser = firebase.auth().currentUser;
  
  userDoc.get().then((doc) => {
    if (doc.exists) {
      const userDocData = doc.data();
       colorPicker.value = userDocData.color;
      colorPickerToUI(colorPicker.value)
      uiDisplayName.innerText = currentUser.displayName;
      welcomeMessageName.innerText = currentUser.displayName.split(" ")[0];
     ;
    // Retrieve user info
    // retrieve previous messages & user preference -> populate UI
     return resolve();
   
  }
    if (!doc.exists) {
    // register user into DB 
      users.doc(userID).set({
        name: currentUser.displayName,
        color: '',
        id: userID
      });
      // populate UI
      uiDisplayName.innerText = currentUser.displayName;
      welcomeMessageName.innerText = currentUser.displayName.split(" ")[0];
      
      return resolve();
    }

    else {
      return reject();
  }
  });
 

  })
};


async function asyncInitializeUser(userID) {
  await initializeUser(userID);
   // Once promise has initialized UI and resolved
  try {
    getAllOnlineUsers();
      // reveal populated UI
      loadingSection.hidden = true;
      mainWrapper.hidden = false;
  header.style.opacity = 1;
  }
  catch (err) {
    console.log(err);
  }
};


// Get all online users from database - must look at ommitting as much of this functionality from client side as possible and handle it server side with Firebase cloud functions once the app scales.

// As retrieving a high amount of documents from the Database client side is an inneficient solution both in terms of usability and pay as you go Firebase costs?

function getAllOnlineUsers () {

  db.collection('users').where("isOnline", "==", true).onSnapshot((snapshot) => {

        snapshot.docChanges().forEach((change) => {
          
          if (change.type === "added") {
              usersOnlineCount.innerText = "( " + snapshot.size + " )";
            console.log(change.doc.data());
            appendUsers(change.doc.data().id, change.doc.data().name, change.doc.data().color);
                const classHtmlCollection = document.getElementsByClassName(change.doc.data().id);
        const classArray = Array.from(classHtmlCollection);
            classArray.forEach((element) => {
              element.style.color = change.doc.data().color;
            });
            }
          if (change.type === "modified") {
              usersOnlineCount.innerText = "( " + snapshot.size + " )";
            console.log(change.doc.data(), "changed");
              const classHtmlCollection = document.getElementsByClassName(change.doc.data().id);
        const classArray = Array.from(classHtmlCollection);
            classArray.forEach((element) => {
              element.style.color = change.doc.data().color;
              });
            }
          if (change.type === "removed") {
            usersOnlineCount.innerText = "( " + snapshot.size + " )";
           
            console.log(change.doc.data(), "removed");
            document.getElementById(change.doc.data().id).remove();
            }
        });
    });

};

// change snapshot to .where online==true, remove users by document.getelementbyid and change colours by document.queryselectorall 


function appendUsers(userID, name, color) {


    const userOnlineDiv = document.createElement('div');
    userOnlineDiv.classList.add("online-box__user-container");
    userOnlineDiv.setAttribute('id', userID);
    
    const userOnlineH2 = document.createElement('h2');
    userOnlineH2.innerText = name;

    const userOnlineIcon = document.createElement('i');
    userOnlineIcon.classList.add("fas", "fa-user-circle", userID);
    userOnlineIcon.style.color = color;

    userOnlineDiv.appendChild(userOnlineIcon);
    userOnlineDiv.appendChild(userOnlineH2);

    userOnlineContainer.appendChild(userOnlineDiv);
  
};



// ----------------- Sending message to DOM and Updating DB ------------------------


msgButton.addEventListener('click', (event) => {
  
  event.preventDefault();
  const msg = msgInput.value;
  
  if (msg.length < 1) {
    // Send an error if the message is empty
   sendErrorMsg("An empty message cannot be sent... :)");
    return
  };

  sendMessageToDOM(msg);
  // import from message.js - send the new message to the DOM with colours currently in color picker

// TO DO - Send message to database

  msgInput.value = '';
  return

});


// -------------------- Logout Button ----------------------


logoutBtn.addEventListener('click', function () {

  // Firebase signout method 

  firebase.auth().signOut();


});


// -------------------- Check and Send Colour to Databse -------------------


function newColorToDB() {

  // listening to change of color
  
  colorPicker.addEventListener('change', () => {

    // check for color readbility -> convert new hex to RGB and get the sum of RGB
    const sumOfRGB = hexToRGB();

    if  (sumOfRGB > 650) {
// if the sum is greater 650 -> retrieve the last accepted color stored in DB and throw an error to the UI

      const users = db.collection('users');
      const userDoc = users.doc(firebase.auth().currentUser.uid);

      userDoc.get().then((doc) => {

        const userDocData = doc.data();
        colorPicker.value = userDocData.color;
        colorPickerToUI(colorPicker.value);

        sendErrorMsg("Please choose a reader friendly colour :)");

      });

      return
    
    }

    else {

      // if sum of RGB is less then 650 new color is accepted and is sent to DB

      const user = firebase.auth().currentUser;
      const userDoc = db.collection('users').doc(user.uid);
  
      userDoc.update({
        color: colorPicker.value,
      });

      return

    }

  });

};



// -------------------- On Load ------------------------

window.addEventListener('DOMContentLoaded', () => {

  sidebarFunctionality();
  
  // import from sidebar.js - toggle functionality for responsive sidebar

  colorPickerInput();
 
  // import from colorPicker.js - changes the UI elements.style upon color picker input

  newColorToDB();

  // import from colorPicker.js - checks new color if its ok then sends to DB

});



// < -------------- CODE TESTING ENVIRONMENT 🤠🤠 --------------------->

// Write and test new functions here before modularization 











  // <-------------- CODE TESTING ENVIRONMENT END 🤠🤠 ---------------------------->





  //  -------------- EXAMPLES FOR REFERENCING ---------------

const users = db.collection('users');

const kezDoc = users.doc('kez');

kezDoc.get().then((doc) => {
  if (doc.exists) {
    console.log(doc.data());
  }
  else {
    console.log("No such collection");
  }
});





  //                TO DO LISTTTTT

  // BEFORE ANY MORE CODE IS WRITTEN - Write out a complete explanation of the project so far in NOTES.

  // PLAN NEXT STEPS - Write out logical next steps of what needs to be done to get it working 

  // CREATE A BACKUP BEFORE PROCEEDING
