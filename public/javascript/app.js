// ------------------ Import Functions and Database Object -----------------

import sidebarFunctionality from "./components/sidebar.js"
import { sendYourMessageToDOM, sendErrorMsg} from "./components/message.js"
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
    return;
  }  
   else {
    // User is signed out
    // Send to login page
    window.location.href = "https://thechatroom-kez.web.app/login.html"
  }
});

// initializing user function returning a promise with the userID passed in as argument. Promise checks if the user is registered or not in the database, initalizes the UI accordingly... (called in the below sync await function that awaits this to resolve before revealing UI - this is then called in above function listening to auth login) 


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
        color: "#7161ef",
        id: userID,
        isOnline = true
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

// <---------------- Listening for changes to isOnline within user doc -------------------->


// Get all online users from database - must look at ommitting as much of this functionality from client side as possible and handle it server side with Firebase cloud functions once the app scales.

// As retrieving a high amount of documents from the Database client side is an inneficient solution both in terms of usability and pay as you go Firebase costs?

function getAllOnlineUsers() {
  
  // accessing a snapshot of all users with field isOnline = true

  db.collection('users').where("isOnline", "==", true).onSnapshot((snapshot) => {

        snapshot.docChanges().forEach((change) => {
          
          if (change.type === "added") {

          // on initialization as well as listening for new online users

            usersOnlineCount.innerText = "( " + snapshot.size + " )";
            
            console.log(change.doc.data());
            appendUsers(change.doc.data().id, change.doc.data().name, change.doc.data().color);

            const classHtmlCollection = document.getElementsByClassName(change.doc.data().id);
            const classArray = Array.from(classHtmlCollection);

            classArray.forEach((element) => {
              element.style.color = change.doc.data().color;
            });

          };
          
          if (change.type === "modified") {

            // if a change occurs to the users document such as color preference is updated then send this update to the UI

            usersOnlineCount.innerText = "( " + snapshot.size + " )";
            
            console.log(change.doc.data(), "changed");
            
            const classHtmlCollection = document.getElementsByClassName(change.doc.data().id);
            const classArray = Array.from(classHtmlCollection);
            classArray.forEach((element) => {
              element.style.color = change.doc.data().color;
            });
            
          };

          if (change.type === "removed") {

            // If user goes offline remove from online users section

            usersOnlineCount.innerText = "( " + snapshot.size + " )";
            
            console.log(change.doc.data(), "removed");
            document.getElementById(change.doc.data().id).remove();

          };

        });
    });

};

// change snapshot to .where online==true, remove users by document.getelementbyid and change colours by document.queryselectorall 


function appendUsers(userID, name, color) {

  // appends the online user to the DOM 


    const userOnlineDiv = document.createElement('div');
    userOnlineDiv.classList.add("online-box__user-container");
    userOnlineDiv.setAttribute('id', userID);
    
    const userOnlineH2 = document.createElement('h2');
    userOnlineH2.innerText = name;

    const userOnlineIcon = document.createElement('i');
    userOnlineIcon.classList.add("fas", "fa-user-circle", userID);
    userOnlineIcon.style.color = color;

  userOnlineDiv.appendChild(userOnlineH2);
    userOnlineDiv.appendChild(userOnlineIcon);
    

    userOnlineContainer.appendChild(userOnlineDiv);
  
};



// ----------------- Sending message to DOM and Updating DB ------------------------


msgButton.addEventListener('click', (event) => {
  
  event.preventDefault();
  const msg = msgInput.value;
  const user = firebase.auth().currentUser;
  
  if (msg.length < 1) {
    // Send an error if the message is empty
   sendErrorMsg("An empty message cannot be sent... :)");
    return
  };

  sendYourMessageToDOM(msg);
   // import from message.js - send the new message to the DOM with colours currently in color picker
  
  sendMsgtoDB(msg, user.uid);
 

  msgInput.value = '';
  return

});

function sendMsgtoDB(msg, userID) {

  // creates a new document within messages collection 
    
  const messagesCollection = db.collection('messages');
  const timeStampNow = firebase.firestore.Timestamp.now();
  // sets a timestamp within firestore

  messagesCollection.doc(userID + "-" + timeStampNow.toDate()).set({
        id: userID,
        message: msg,
        timeStamp: timeStampNow
      });
  

}
  
// Getting new messages and appending them to the DOM ------ function called in DOM Content Loaded


function snapshotNewMsgs() {

  // wrapped in a function to call within dom content loaded, also adds a layer of security within clients browser

db.collection("messages")
  .orderBy("timeStamp", "desc").limit(1).onSnapshot((snapshot) => {
    
    snapshot.forEach((message) => {
      
      const user = firebase.auth().currentUser.uid;
      const newMsg = message.data();
      const messageDateInSeconds = newMsg.timeStamp.seconds;
      const currentDateTS = firebase.firestore.Timestamp.fromDate(new Date()).seconds - 10;
      // creates a timestamp from a javascript date value
      
      if (newMsg.id === user) {
        // if message is from the current user then return
        return
      }

      if (messageDateInSeconds < currentDateTS) {
        // snapshot will trigger onload as well as act as a listener, therefore this checks if the message was sent in the last 10 seconds when the UI is loaded if it isnt then return
      
        return
     }
      
      else {

      // send to dom 
        sendOtherUserMsg(newMsg.message, newMsg.id)
       
      }


   
    })
  });
}


function sendOtherUserMsg(msg, id) {

  // get the user from the DB with the message ID for their username and color

  const userDocument = db.collection('users').doc(id);

  userDocument.get().then((doc) => {
  
    if (doc.exists) {

// append the users message to the dom with the correct attributes and stylings

    const username = doc.data().name;
    const color = doc.data().color;

    const msgWrapper = document.createElement('div');
    msgWrapper.classList.add('message-container-wrapper');

  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message-box__message-container');

  
   const msgContent = document.createElement('p');
  msgContent.classList.add('message-content');
  msgContent.innerHTML = `<span class="main-col ${id}" style="color: ${color};">${username}:</span> ${msg}`
  

  msgContainer.appendChild(msgContent);
  msgWrapper.appendChild(msgContainer);
  
  msgBox.insertBefore(msgWrapper, msgBox.firstChild);


    }
    
    else {
      
      return
      
    }
    
});

};



// -------------------- Logout Button & Beforeunload event ----------------------


logoutBtn.addEventListener('click', function () {

  // Firebase signout method 

  const user = firebase.auth().currentUser.uid;
  falseIsOnline(user);


  firebase.auth().signOut();


});

function falseIsOnline(userID) {
  
  const isOnline = db.collection('users');

  isOnline.doc(userID).update({
    isOnline: false,
  });

};

addEventListener('beforeunload', (event) => {
  const user = firebase.auth().currentUser.uid;
  falseIsOnline(user);


  firebase.auth().signOut();


})


// -------------------- Check and Send Colour to Databse -------------------


function newColorToDB() {

  // listening to change of color
  
  colorPicker.addEventListener('change', () => {

    // check for color readbility -> convert new hex to RGB and get the sum of RGB
    const sumOfRGB = hexToRGB();

    if  (sumOfRGB > 620) {
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

  snapshotNewMsgs();

  // from above - listens for new message documents written into messages collection and appends them to the DOM

});



// < -------------- CODE TESTING ENVIRONMENT 🤠🤠 --------------------->

// Write and test new snippets of code here before modularization 





// ---------- !! TO DO !!---------  

// Configure ON DISCONNECT functionality
// Wrap all of app.js in IIFE






  // <-------------- CODE TESTING ENVIRONMENT END 🤠🤠 ---------------------------->



  //  -------------- EXAMPLES FOR REFERENCING ---------------

// const users = db.collection('users');

// const kezDoc = users.doc('kez');

// kezDoc.get().then((doc) => {
//   if (doc.exists) {
//     console.log(doc.data());
//   }
//   else {
//     console.log("No such collection");
//   }
// });
