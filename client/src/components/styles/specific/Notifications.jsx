import {
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";
import React, { memo } from "react";
import { sampleNotifications } from "../../../constants/SampleData";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../../redux/api/api";
import { useErrors } from "../../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../../redux/reducers/misc";
import { toast } from "react-hot-toast";

function Notifications() {
  
  const {isLoading,data,error,isError}=useGetNotificationsQuery();
  const {isNotification}=useSelector((state)=>state.misc)
  useErrors([{error,isError}]);
  const dispatch=useDispatch();
  const closeHandler=()=>(dispatch(setIsNotification(false)));
  const [acceptRequest]=useAcceptFriendRequestMutation();

  
  const friendRequestHandler =async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const res=await acceptRequest({requestId:_id,accept})
      if(res.data?.success) {
        console.log("Use socket ",res.data.message),
        toast.success(res.data.message);
      }else{
            toast.error(res.data?.error || "Something went wrong ");
      };
    } catch (error) {
      toast.error( "Something went wrong ");
      console.log(error)
    }
  };
  
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack>
        <DialogTitle p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
          Notifications
        </DialogTitle>
        {
          isLoading? (<Skeleton/>):<>{data?.allRequests.length > 0 ? (
            data?.allRequests.map(({ sender, _id }) => (
              <NotificationItem
                handler={friendRequestHandler}
                key={_id}
                sender={sender}
                _id={_id}
              />
            ))
          ) : (
            <Typography textAlign={"center "}> 0 notifications</Typography>
          )}
          </>
        }
      </Stack>
    </Dialog>
  );
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request . `}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
