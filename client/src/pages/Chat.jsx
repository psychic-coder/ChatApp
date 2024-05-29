import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/styles/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../styles/StyledComponent";
import FileMenu from "../components/styles/dialogs/FileMenu";
import { sampleMessage } from "../constants/SampleData";
import MessageComponent from "../components/styles/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useChatDetailsQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";


function Chat({ chatId,user }) {
  const containerRef = useRef(null);
  const socket = getSocket();

  //skip makes sure if chatId is present then only we call it , otherwise we refuse to call it
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  //console.log(chatDetails);

  const [messages,setMessages]=useState([]);
  console.log(messages);

  const members = chatDetails?.data?.chat?.members;
 

  const [message, setMessage] = useState("");
  
  const errors=[{isError:chatDetails}]

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    //emitting messsage to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };


  //A callback is a function passed as an argument to another function, to be executed after some operation completes.
  /*useCallback hook is used to memoize callback functions. This means that it returns a memoized version of the callback that only changes if one of the dependencies has changed. It is useful for optimizing performance, especially in components that rely on reference equality to avoid unnecessary re-renders.*/
  /*useCallback memoizes functions to prevent unnecessary re-renders, especially when passing callbacks to child components.
It takes a function and a dependencies array, and returns a memoized version of the function.*/
  const newMessagesHandler=useCallback((data)=>{
    setMessages((prev)=>[...prev,data.message])
  },[]);
  

const eventHandler={[NEW_MESSAGE]:newMessagesHandler};
  useSocketEvents(socket,eventHandler)
  useErrors(errors)
 


  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        backgroundColor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {messages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </Stack>
      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type you messages here ....."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  );
}

export default AppLayout()(Chat);
