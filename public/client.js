const socket = io();

socket.on("connect", () => console.log("Client connected"));
socket.on("message", (message) => console.log(message));
