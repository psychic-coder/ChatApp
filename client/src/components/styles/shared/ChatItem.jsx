import React, { memo } from "react";
import { Link } from "../../../styles/StyledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import {motion} from "framer-motion"

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  /*onContextMenu Prop:
The onContextMenu prop is added to the element you want to attach the context menu event to.
When a user right-clicks on this element, the function specified in the prop will be executed.*/

  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
      initial={{
        opacity:0,y:"-100%"
      }}

      whileInView={{
        opacity:1,y:0
      }}

      transition={{
        delay:index*0.1
      }}

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
       <AvatarCard avatar={avatar}/>
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
      </motion.div>
    </Link>
  );
};

//as this function is to be mapped we wrap it on memo
export default memo(ChatItem);
