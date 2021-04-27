const username = window.location.search.replace('?', '').split('&')[0].split('=')[1];
const roomId = window.location.search.replace('?', '').split('&')[1].split('=')[1];

const socket = io();
updateNameChat(roomId);

socket.emit('user_in_room', { username, roomId });

socket.on('list_users', (list) => {
  const users = list.map(user => user.username);
  
  users.forEach(username => {
    addLogInBoxLogs(username, true);
    addUserInBoxUsers(username);
  })
});

socket.on('user_in', (data) => {
  const userIn = data.username;
  addLogInBoxLogs(userIn, true);
  addUserInBoxUsers(userIn);
});

socket.on('user_out', (data) => {
  const userOut = data.username;
  addLogInBoxLogs(userOut);
  removeUserInBoxUsers(userOut);
});

socket.on('receive_message', (dataMessage) => {
  const { username, message } = dataMessage;
  receiveMessage(username, message);
})


document.querySelector('#sendMessage button').addEventListener("click", (event) => {
  const data = document.querySelector('#sendMessage textarea');
  socket.emit('send_message', { username, message: data.value, roomId  });
  addMessageInBoxChat(username, data.value);
  data.value = "";
});

document.querySelector('#sendMessage textarea').addEventListener('keyup', (event) => {
  if(event.key === 'Enter') {
    const data = document.querySelector('#sendMessage textarea');
    socket.emit('send_message', { username: username, message: data.value, roomId  });
    addMessageInBoxChat(username, data.value);
    data.value = "";
  }
});


function addMessageInBoxChat(username, text) {

  if(text !== "") {
    const mainChat = document.getElementById('main-chat');
    const messageBox = document.createElement('div');
    messageBox.id = username;
    messageBox.classList.add('message-box', 'myself-user');
    messageBox.innerHTML = `
      <p class="username">${username}</p>
      <p>${text}</p>
    `
    mainChat.appendChild(messageBox);
    scrollToBottom(document.getElementById('main-chat'));
  }
}

function receiveMessage(username, message) {
  /* 
    <div class="message-box others">
      <p class="username">Pedro</p>
      <p>Bom dia Henrique!</p>
    </div>
  */

  const mainChat = document.getElementById('main-chat');
  const newMessage = document.createElement('div');
  newMessage.classList.add('message-box', 'others');

  newMessage.innerHTML = `
    <p class="username">${username}</p>
    <p>${message}</p>
  `;

  mainChat.appendChild(newMessage);
  scrollToBottom(document.getElementById('main-chat'));

}

function addUserInBoxUsers(username) {
  const usersDiv = document.getElementById('allUsers');
  const newUser = document.createElement('div');
  newUser.id = username;
  newUser.classList.add('user');

  newUser.innerHTML = `
    <h3>${username}</h3>
  `;

  usersDiv.appendChild(newUser);
  scrollToBottom(document.getElementById('allUsers'));
}

function removeUserInBoxUsers(username) {
  const usersDiv = document.getElementById('allUsers');
  const userToRemove = document.getElementById(username);
  usersDiv.removeChild(userToRemove);
}

function addLogInBoxLogs(username, joined) {
  /*
    joined = true => in
    joined = false => out

    <div class="log">
      <p class="usernameLog">Henrique</p>
      <p class="joined">joined on room</p>
    </div>
  */

  const logs = document.getElementById('allLogs');
  const newLog = document.createElement('div');
  newLog.classList.add('log');
  newLog.innerHTML = `
    <p class="usernameLog">${username}</p>
  `;

  if(joined)
    newLog.innerHTML += `<p class="joined">joined on room</p>`
  else
    newLog.innerHTML += `<p class="left">left the room</p>`
  
  logs.appendChild(newLog);
  scrollToBottom(document.getElementById('allLogs'));
}

function updateNameChat(roomId) {
  const sectionChat = document.getElementById('chat');
  const mainChat = document.getElementById('main-chat');

  const nameRoom = document.createElement('h4');
  nameRoom.innerText = roomId;

  sectionChat.insertBefore(nameRoom, mainChat);
}

function scrollToBottom(component) {
  component.scrollTop = component.scrollHeight;
}
