const socket = io();

socket.on("connect", () => console.log("Client connected"));
// socket.on("message", (message) => console.log(message));
const roomId = window.location.pathname.split("/").pop(); // Get room ID from URL

console.log(roomId);
document.getElementById("joinRoomBtn") &&
  document.getElementById("joinRoomBtn").addEventListener("click", () => {
    const username = document.getElementById("usernameInput").value;
    document.getElementById("usernameInput").disabled = true;
    document.getElementById("joinRoomBtn").disabled = true;

    if (username) {
      socket.emit("joinRoom", { roomId, username });
    }
  });

document.getElementById("sendMessageBtn") &&
  document.getElementById("sendMessageBtn").addEventListener("click", () => {
    const message = document.getElementById("messageInput").value;
    document.getElementById("messageInput").value = "";
    if (message) {
      socket.emit("sendMessage", { roomId, message });
    }
  });

socket.on("message", (msg) => {
  const chatBox = document.getElementById("chatBox");
  //   const messageElement = document.createElement("p");
  //   messageElement.innerText = msg;
  const messageLi = msg.map((mes) => `<li>${mes}</li>`).join("");
  console.log(messageLi, msg);
  chatBox.innerHTML = messageLi;
});

// Handle room full error
socket.on("roomFull", (msg) => {
  alert(msg);
  window.location.href = "/room/create"; // Redirect to create a new room
});
