import express from "express";
import ejsMate from "ejs-mate";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { randomUUID } from "crypto";
const rooms = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const port = 5000;
function getUsername(roomId, socketId) {
  const room = rooms[roomId]; // Get the room object
  if (!room) return null; // If room doesn't exist, return null

  const user = room.users.find(([id, name]) => id === socketId);
  return user ? user[1] : null; // Return the username if found, else null
}
// io.on("connection", (socket) => {
//   console.log("New user connected to server: " + socket.id);
//   socket.emit("message", "Welcome to Socket.io " + socket.id);
//   socket.on("disconnect", () => console.log(`${socket.id} is disconnected!!`));
// });
app.get("/room/create", (req, res) => {
  const roomId = randomUUID().slice(0, 6); // Generate a short room ID
  console.log(roomId);
  rooms[roomId] = { users: [], chat: [] }; // Initialize room
  res.redirect(`/room/${roomId}`); // Redirect to new room
});

app.get("/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  console.log(rooms[roomId]);

  // If room doesn't exist, redirect to create a new one
  if (!rooms[roomId]) {
    return res.redirect("/room/create");
  }

  res.render("room", { roomId });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("errorMessage", "Room does not exist.");
      return;
    }
    // Check if room is full (max 4 users)
    if (rooms[roomId].users.length >= 4) {
      socket.emit("roomFull", "This room is full. Create a new one.");
      return;
    }

    // Add user to room
    socket.join(roomId);
    rooms[roomId].users.push([socket.id, username]);
    rooms[roomId].chat.push(`${username} has joined the room.`);
    console.log(rooms[roomId].chat);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    io.to(roomId).emit("message", rooms[roomId].chat);

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected from room: ${roomId}`);
      rooms[roomId].users = rooms[roomId].users.filter(
        (id) => id[0] !== socket.id
      );

      // If room is empty, delete it
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }
    });
  });

  // Handle messages in the room
  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("message", rooms[roomId].chat);
  });
});

app.all("/", (req, res) => {
  res.render("home");
});

server.listen(port, () => console.log("Server is running on port: " + port));
