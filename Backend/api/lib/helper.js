import { userSocketIDs } from "../app.js";

export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) => {
  //we give the id of the users and get hold of the values of the sockets corresponding to that particular user from tge userSocketIDs and then we return the socket array
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));
  return sockets;
};


/*Base64 is an encoding scheme that converts binary data (such as images, files, or any other binary content) into an ASCII string format. The encoded data is typically used in data transfer protocols, such as email via MIME, and for embedding image data within HTML or CSS file*/
/*Base64 encoding transforms binary data into a text string, making it safe to transmit over text-based protocols like HTTP, SMTP, or JSON.*/
/*The code you provided converts a file object into a Base64-encoded string*/
/*its a basic code and its sameeverywhere , if you have doubt then ask gpt for explaination*/
export const getBase64=(file)=>`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;