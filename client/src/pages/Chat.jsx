import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/styles/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../styles/StyledComponent";
import FileMenu from "../components/styles/dialogs/FileMenu";
import { useInfiniteScrollTop } from "6pp";
import MessageComponent from "../components/styles/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useGetMessagesQuery,
} from "../redux/api/api";
import { useAsyncMutation, useErrors, useSocketEvents } from "../hooks/hook";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/styles/layout/Loaders";
import { useNavigate } from "react-router-dom";

function Chat({ chatId, user }) {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  //skip makes sure if chatId is present then only we call it , otherwise we refuse to call it
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  //console.log(chatDetails);
  const [messages, setMessages] = useState([]);
  const members = chatDetails?.data?.chat?.members;

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(null);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  //in the infinite scroll the setPage will set the value of page  and it will increase automatically when we scroll
  //the containerRef is referring to the stack ref ,we want to refer to
  //setOldMessages is not used , here  but it can be used to clear all the old messages
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

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
  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  useEffect(() => {
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  const alertListener = useCallback(
    ( data) => {
      if(data.chatId!==chatId) return;
      const messageForAlert = {
        content:data.message,
        sender: {
          _id: "ftyfyfjyfyf",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [ALERT]: alertListener,
  };
  useSocketEvents(socket, eventHandler);
  useErrors(errors);
  const allMessages = [...oldMessages, ...messages];
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  //on reloading we are automatially at the bottom of the page
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

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
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        {/*on reloading we are automatially at the bottom of the page*/}
        <div ref={bottomRef} />
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
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type you messages here ....."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
}

export default AppLayout()(Chat);
