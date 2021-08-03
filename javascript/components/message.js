

// ---------- DOM Elements ----------------

const msgBox = document.getElementById('messageBox');
const colorPicker = document.getElementById('favcolor');
const errorMsg = document.getElementById('errorMsg');



// -------------- Appending message to dom function, called inside sendmessage event listener in App.js --------------

export function sendMessageToDOM(msg) {
  
  const msgWrapper = document.createElement('div');
  msgWrapper.classList.add('message-container-wrapper', 'youwrap');

  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message-box__message-container', 'you', 'bg-change');

  
   const msgContent = document.createElement('p');
  msgContent.classList.add('message-content');
  msgContent.innerText = "You: " + msg;

  msgContainer.appendChild(msgContent);
  msgWrapper.appendChild(msgContainer);
  
  msgBox.insertBefore(msgWrapper, msgBox.firstChild);

  // setting color of your message container to color currently in the color picker

  msgContainer.style.backgroundColor = colorPicker.value;
        msgContainer.style.boxShadow = "1px 1px 12px" + colorPicker.value + "71  ";


};



// ------------ Error message to user function ----------------


export function sendErrorMsg(message) {
  
  errorMsg.children[1].innerText = message;
    
  errorMsg.classList.add('error__animation');
      
  errorMsg.addEventListener('animationend', function () {
        
    errorMsg.classList.remove('error__animation');


  })
};