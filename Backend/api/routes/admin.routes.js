import express from "express";
import { adminLogin, adminLogout, allChats, allMessagaes, allUsers, getAdminData, getDashboard } from "../controllers/admin.controllers.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const app=express.Router();

app.post("/verify",adminLoginValidator(),validateHandler,adminLogin);
app.get("/logout",adminLogout);

//below this alll routes can only be accessed by admins
//so we need to create a middleware

app.use(adminOnly);

app.get("/",getAdminData);
app.get("/users",allUsers);
app.get("/chats",allChats);
app.get("/messages",allMessagaes);
app.get("/stats",getDashboard);




export default app;