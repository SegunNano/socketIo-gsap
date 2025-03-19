const socket = io();

socket.on("connect", () => console.log("Client connected"));
const roomId = window.location.pathname.split("/").pop();

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
  const messageLi = msg.map((mes) => `<li>${mes}</li>`).join("");
  console.log(messageLi, msg);
  chatBox.innerHTML = messageLi;
});

socket.on("roomFull", (msg) => {
  alert(msg);
  window.location.href = "/room/create";
});
