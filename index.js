import express from "express";
import ejsMate from "ejs-mate";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import { Server } from "socket.io";
import http from "http";
import path from "path";

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
io.on("connection", (socket) => {
  console.log("New user connected to server: " + socket.id);
  socket.emit("message", "Welcome to Socket.io " + socket.id);
  socket.on("disconnect", () => console.log(`${socket.id} is disconnected!!`));
});

app.all("/", (req, res) => {
  res.render("home");
});

server.listen(port, () => console.log("Server is running on port: " + port));
