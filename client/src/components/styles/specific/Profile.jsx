import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import  moment from "moment";
import { transformImage } from "../../../lib/features";

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
       src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "cover",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Username"} text={user?.username} Icon={<UsernameIcon/>} />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon/>} />
        {/*using moment we're getiing hold of the date , and then sending the howlong it has from then*/}
      <ProfileCard heading={"Joined"} text={user?.createdAt} Icon={<CalenderIcon/>} />
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
