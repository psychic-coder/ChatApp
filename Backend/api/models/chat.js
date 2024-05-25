import { Schema, Types, model, models } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  groupChat: {
    type: Boolean,
    default:false
  },
  creator: {
    type: Types.ObjectId,
    ref:"User"//it refers to the user collection , 
  },
  members:[{
    type:Types.ObjectId,
    ref:"User",
  }]
},{
    timestamps:true
});

export const Chat = models.Chat || model("Chat", schema);
