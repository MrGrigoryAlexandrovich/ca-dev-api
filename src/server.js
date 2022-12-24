const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const technologies = require("./routes/technologies");
const users = require("./routes/users");
const ratings = require("./routes/ratings");
const connectDB = require("./db/connection");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/technologies/", technologies);
app.use("/api/users/", users);
app.use("/api/ratings/", ratings);

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;

server.listen(
  PORT,
  () => console.log("Server run on ", PORT) // eslint-disable-line
);
