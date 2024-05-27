import { userSocketIDs } from "../app.js";

export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) => {
  //we give the id of the users and get hold of the values of the sockets corresponding to that particular user from tge userSocketIDs and then we return the socket array
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));
  return sockets;
};
