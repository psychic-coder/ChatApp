import { Schema, Types, model, models } from "mongoose";

const schema = new Schema(
  {
    content: String,
    
    attachements: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    sender: {
      type: Types.ObjectId,
      ref: "User", //it refers to the user collection ,
      required: true,
    },

    chat: {
      //it will contain the chatid
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = models.Message || model("Message", schema);
