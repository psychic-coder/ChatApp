import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

export const newUser = TryCatch(async (req, res, next) => {
  //req.file option is the option we get from multer middleware
  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("Please upload avatar"));
  }
  const results=await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: results[0].public_id,
    url: results[0].url,
  };

  const { name, username, password, bio } = req.body;

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  sendToken(res, user, 201, "User Created !");
});
export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  //as in the models while creating we have made the default password select=false, so we're particularly asking for the password from the database
  const user = await User.findOne({ username }).select("+password");
  //the next keyword will automatically call the error middlware
  if (!user) return next(new ErrorHandler("Invalid Credentials !!", 400));
  const isMatch = await compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid Credentials !!", 400));

  sendToken(res, user, 200, `Welcome Back ${user.name} !`);
});

export const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = TryCatch(async (req, res) => {
  //we're simply setting the value of the cookie to null , overwriting the cookieOptions maxage to 0
  return res
    .status(200)
    .cookie("access_token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const searchUser = TryCatch(async (req, res, next) => {
  //we have to search all the users, who are not our friend , but as we have not created any friend array, so we have to search for all the chats we're involved in

  const { name = "" } = req.query;

  //finding all the chats except the group chats in which i am involved
  const myChats = await Chat.find({
    groupChat: false,
    members: req.user,
  });

  //The .flatMap() method in JavaScript is used to create a new array with all sub-array elements concatenated into it recursively up to the specified depth.
  //in the below code we're getting hold of all the members we have chatted with , basically my friends
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  /*The query criteria { _id: { $nin: allUsersFromMyChat } } means it will return all user documents where the _id is not in the allUsersFromMyChat array.
   */
  //nin==>not in
  //$regex: Used for pattern matching in MongoDB queries.
  //$options: "i": Makes the regex search case-insensitive.
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  //modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});

export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Friend request Sent !!",
  });
});

export const acceptFriendRequest = TryCatch(async (req, res) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request !!", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected ",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend request accepted ",
    senderId: request.sender._id,
  });
});

export const getMyNotifications = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

export const getMyFriends = TryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;
  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    //in this below code we're using chatId , as when we want to add people to our grp , so we check whether they are already present in a group or not ,if they are not
    //then we can add them in the grp
    const chat = await Chat.findById({ chatId });
    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});
