import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ALERT, NEW_ATTACHMENT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (members.length < 3) {
    new ErrorHandler("Group chat must have atleast 3 members", 400);
  }
  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });
  emitEvent(req, ALERT, allMembers, `Welcome to the ${name} group !!!! `);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created ",
  });
});
export const getMyChats = TryCatch(async (req, res, next) => {
  //name  and avatar tell us  the data we want from the populated members array
  const chats = await Chat.find({
    members: req.user,
  }).populate("members", "name  avatar");

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      //we made the other member an array as in frontend we expect an array
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      //in the below reduce method we have used a reduce function , which takes to values prev and curr, the prev shows the emty array , and the curr holds the data of the members array
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

export const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members && members.length < 1)
    return next(new ErrorHandler("Please provide members", 400));

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("CHAT NOT FOUND !!!", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a groupChat !!!", 400));

  //only the creator of the group can add members
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You're not allowed to add members", 403));

  //allNewMembersPromise: This variable now holds an array of promises. Each promise corresponds to the asynchronous operation of fetching a user by their ID.
  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  /*Promise.all takes an array of promises and returns a single promise.
This returned promise resolves when all the promises in the array have resolved.
If any of the promises in the array reject, the returned promise will reject with the reason of the first promise that rejects.*/
  const allNewMembers = await Promise.all(allNewMembersPromise);

  //in the below line we're getting hold of the unique userid's
  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group members limit reached ", 400));
  }

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added in the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully !! ",
  });
});

export const removeMembers = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const { chat, userThatWillBeRemoved } = await Promise.all([
    chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("CHAT NOT FOUND !!!", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a groupChat !!!", 400));

  //only the creator of the group can remove members
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You're not allowed to add members", 403));

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have atleast 3 members ", 400));

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed from the group !!! `
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully !!!!",
  });
});
export const leaveGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("CHAT NOT FOUND !!!", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat !!!!", 400));

  const remainingMembers = chat.membersfilter(
    (member) => member.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3) {
    return next(new ErrorHandler("Group must have atleast 3 members", 400));
  }

  if (chat.creator.toString() === req.user.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[randomElement];

    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} has left the group !!! `);
  return res.status(200).json({
    success: true,
    message: "Member left successfully !!!!",
  });
});

export const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);
  if (!chat) return next(new ErrorHandler("Chat not found !!!!", 404));
  //the req.files we get using the middleware multer.js
  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments ", 400));

  const attachements = [];

  //uploading of files takes place overhere

  const messageForDB = {
    content: "",
    attachements,
    sender: me._id,
    chat: chatId,
  };
  //the below message we'll send in the socket
  const messageForRealTime = {
    ...messageForDB,
    sender: {
      id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });
  emitEvent(req, REFETCH_CHATS, chat.members, {
    chatId,
  });

  return res.status(200).json({
    success: true,
    message,
  });
});

export const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.params.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    //on using .lean() we don't need to save the data in the mongoose,as it skips the process of Mongoose skips the process of converting the MongoDB documents into full Mongoose documents
    // The .lean() method optimizes query performance by returning plain JavaScript objects.
    if (!chat) return next(new ErrorHandler("Chat not found ", 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return next(new ErrorHandler("Chat not found ", 404));
    }
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

export const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found ", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to rename the group ", 403)
    );
  }
  chat.name = name;
  await chat.save();
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully !!!",
  });
});

export const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found ", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to delete the group", 403)
    );
  }
  if (!chat.groupChat && !chat.member.includes(req.user.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete the chat", 403)
    );
  }
  //here we have to delete all messages as well as attachments or files from cloudinary
  /*$exists: true: This condition ensures that the attachments field exists in the document.
$ne: []: This condition ensures that the attachments field is not equal to an empty array ([]).*/
  //in messageWithAttachments in the below we're getting hold of the messages which contain the attachments field
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachements: { $exists: true, $ne: [] },
  });
  const public_ids = [];

  messagesWithAttachments.forEach(({ attachements }) =>
    attachements.forEach(({ public_ids }) => public_ids.push(public_ids))
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    /*Deletes the chat document itself from the database.
Deletes all messages associated with the chat from the database.*/
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});
