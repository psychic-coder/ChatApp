import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import userRoute from "../api/routes/user.routes.js";
import chatRoute from "../api/routes/chat.routes.js";
import adminRoute from "../api/routes/admin.routes.js";
import { connectDB } from "../api/utils/features.js";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { createMessagesInAChat } from "./seeders/chat.js";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import {v2 as cloudinary} from "cloudinary" 

dotenv.config();

const userSocketIDs = new Map();

//mongoURI=process.env.MONGO_URI;
connectDB("mongodb://localhost:27017/ChatterBox");

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

var app = express();
const server = createServer(app);
app.use(logger("dev"));
//we did cross origin as our users are gonna be from different platforms
app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:4173",process.env.CLIENT_URL],
    credentials: true,
  })
);
//express.json is used to access the json data from the frontend

const io = new Server(server, {});

app.use(express.json());
//express.urlencoded is used when we send form data from the frontend
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// createSingleChats(10);
// createGroupChats(10);
//createMessagesInAChat("6652fad5328fb55d8d43b9dc",50)

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello  WORLD !");
});

//we creating a socket middleware overhere
io.use((socket, next) => {});

io.on("connection", (socket) => {
  const user = {
    _id: "hgsv",
    name: "vs",
  };

  //we are mapping the value of user._id to socket.id,which means that the user with user._id is connected to that particular socket.id
  userSocketIDs.set(user._id.toString(), socket.id);

  console.log(userSocketIDs);
  //console.log("A user connected ",socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };
    const membersSocket = getSockets(members);

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "rohitIeeeCs96";

const port = 5000;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} mode `);
});

export default app;

export { userSocketIDs };
