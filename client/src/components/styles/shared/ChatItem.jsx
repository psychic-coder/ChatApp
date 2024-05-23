import React, { memo } from "react";
import { Link } from "../StyledComponent";
import { Stack, Typography } from "@mui/material";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChatOpen,
}) => {
    /*onContextMenu Prop:
The onContextMenu prop is added to the element you want to attach the context menu event to.
When a user right-clicks on this element, the function specified in the prop will be executed.*/


  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChatOpen(e,_id,groupChat)}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        {/* Avatar Card */}
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} new Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};


//as this function is to be mapped we wrap it on memo
export default memo(ChatItem);
