import React, { Fragment, useRef } from "react";
import AppLayout from "../components/styles/layout/AppLayout";
import { IconButton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from "../styles/StyledComponent";
import FileMenu from "../components/styles/dialogs/FileMenu";
import { sampleMessage } from "../constants/SampleData";
import MessageComponent from "../components/styles/shared/MessageComponent";

const user={
  _id:"dgddjgdj",
  name:"Rohit"
}

function Chat() {
  const containerRef = useRef(null);
 
  return (
    <Fragment>
      <Stack ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      backgroundColor={grayColor}
      height={"90%"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto"
      }}>
        {
          sampleMessage.map(i=>(
            <MessageComponent key={i._id} message={i} user={user}/>
          ))
        }
      </Stack>
      <form style={{height:"10%"}}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"} >
          <IconButton sx={{
            position:"absolute",
            left:"1.5rem",
            rotate:"30deg",
            
          }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder="Type you messages here ....." />
          <IconButton type="submit" sx={{
            rotate:"-30deg",
            backgroundColor:orange,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              backgroundColor:"error.dark"
            }
          }}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  );
}

export default AppLayout()(Chat);
