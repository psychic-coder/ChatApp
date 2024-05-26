import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMembers,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat
} from "../controllers/chat.controllers.js";
import { attachmentsMulter } from "../middlewares/multer.js";
const router = express.Router();

router.use(isAuthenticated);
router.post("/new", newGroupChat);
router.get("/my", getMyChats);
router.get("/my/groups", getMyGroups);
router.put("/addmembers", addMembers);
router.put("/removemember", removeMembers);
router.delete("/leave/:id",leaveGroup);
router.post("/message",attachmentsMulter,sendAttachments)

//the below is the method for chaining 
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default router;
