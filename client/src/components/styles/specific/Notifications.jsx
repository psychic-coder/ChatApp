import {
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import React, { memo } from "react";
import { sampleNotifications } from "../../../constants/SampleData";

function Notifications() {
  const friendRequestHandler = ({ _id, accept }) => {};
  return (
    <Dialog open>
      <Stack>
        <DialogTitle p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
          Notifications
        </DialogTitle>
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map(({ sender, _id }) => (
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
