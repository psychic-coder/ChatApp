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
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { v2 as cloudinary } from "cloudinary";
import { corsOption } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

dotenv.config();

const userSocketIDs = new Map();
const onlineUsers = new Set();

//mongoURI=process.env.MONGO_URI;
connectDB("mongodb://localhost:27017/ChatterBox");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

var app = express();
const server = createServer(app);
app.use(logger("dev"));
//we did cross origin as our users are gonna be from different platforms
app.use(cors(corsOption));
//express.json is used to access the json data from the frontend

const io = new Server(server, {
  cors: corsOption,
});
//we're saving the instance of io
app.set("io",io);

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
io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user
  //console.log(user);
  //we are mapping the value of user._id to socket.id,which means that the user with user._id is connected to that particular socket.id
  userSocketIDs.set(user._id.toString(), socket.id);

  //console.log(userSocketIDs);
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

      

    //in the below code we're getting hold of the socket id's corresponding to the userids
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

socket.on(START_TYPING,({members,chatId})=>{
    const membersSockets=getSockets(members)
    socket.to(membersSockets).emit(START_TYPING,{chatId})
})
socket.on(STOP_TYPING,({members,chatId})=>{
    const membersSockets=getSockets(members)
    socket.to(membersSockets).emit(STOP_TYPING,{chatId})
})

socket.on(CHAT_JOINED, ({ userId, members }) => {
  onlineUsers.add(userId.toString());

  const membersSocket = getSockets(members);
  io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
});

socket.on(CHAT_LEAVED, ({ userId, members }) => {
  onlineUsers.delete(userId.toString());

  const membersSocket = getSockets(members);
  io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
});

socket.on("disconnect", () => {
  userSocketIDs.delete(user._id.toString());
  onlineUsers.delete(user._id.toString());
  socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
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
