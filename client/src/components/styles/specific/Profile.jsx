import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import  moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "cover",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"kjsfbsk jhfbrsbf skjf"} />
      <ProfileCard heading={"Username"} text={"neil.rohit_"} Icon={<UsernameIcon/>} />
      <ProfileCard heading={"Name"} text={"Rohit Ganguly"} Icon={<FaceIcon/>} />
        {/*using moment we're getiing hold of the date , and then sending the howlong it has from then*/}
      <ProfileCard heading={"Joined"} text={moment('2023-05-23T00:00:00.000Z').fromNow()} Icon={<CalenderIcon/>} />
    </Stack>
  );
};
const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
