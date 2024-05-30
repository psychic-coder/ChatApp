import React, { useCallback, useContext, useEffect } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../../constants/SampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../../redux/reducers/misc";
import { toast } from "react-hot-toast";
import { useErrors, useSocketEvents } from "../../../hooks/hook";
import { getSocket } from "../../../socket";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
} from "../../../constants/events";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../../lib/features";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const socket = getSocket();

    const { isMobile } = useSelector((state) => state.misc);

    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete Chat", _id, groupChat);
    };

    const dispatch = useDispatch();
    const handleMobileClose = () => dispatch(setIsMobile(false));

    useErrors([{ isError, error }]);

    useEffect(()=>{
        getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])

    const newMessageAlertHandler = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    }, [chatId]);
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
    };
    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              w="70vw"
              newMessagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}
        <Grid container sx={{ height: "calc(100vh - 4rem)" }}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", md: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
