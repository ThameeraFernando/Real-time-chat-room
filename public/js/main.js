const socket = io();

//chatForm
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);
//join chat Room
socket.emit("chat-room", { username, room });
//recieve msg from server
socket.on("message", (message) => {
  console.log(message.text);
  outPutMessage(message);

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //get msg by id
  const msg = e.target.elements.msg.value;
  //send message to the server
  socket.emit("chatMessage", msg);
  //clear input feild
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to DOM
function outPutMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.name} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outPutRoomName(room);
  outPutRoomUsers(users);
});

//add room name to dom
function outPutRoomName(room) {
  roomName.innerHTML = room;
}

//add room members to dom
function outPutRoomUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
