import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { orange } from "../../../constants/color";
import {
  Group as GroupIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const SearchDialog=lazy(()=>import("../specific/Search"))
const NotificationDialog=lazy(()=>import("../specific/Notifications"))
const NewGroupDialog=lazy(()=>import("../specific/NewGroup"))

function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const navigate = useNavigate();

  const handleMobile = () => {
    console.log("Mobile");
    setIsMobile((prev) => !prev);
  };
  const openSearch = () => {
    console.log("Search");
    setIsSearch((prev) => !prev);
  };
  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };
  const openNotification = () => {
    setIsNotification((prev) => !prev);
  };
  const logoutHandler = () => {
    console.log("Logout");
  };
  const navigateToGroup = () => navigate("/groups");
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              ChatterBox
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title={"NotificationsIcon "}
                icon={<NotificationsIcon />}
                onClick={openNotification}
              />
              <IconBtn
                title={"Logout "}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {/*
Key Uses of Suspense
Code Splitting:
React.lazy and Suspense are used together to load components lazily, meaning only when they are needed. This helps in reducing the initial load time of your application.
Data Fetching (in combination with libraries like React Query, SWR, or future React features):
Suspense can also be used to handle asynchronous data fetching, displaying a loading indicator while the data is being fetched.*/}
      {isSearch && <Suspense fallback={<Backdrop open/>}>
        <SearchDialog/>
        </Suspense>}
      {isNotification && <Suspense fallback={<Backdrop open/>}>
        <NotificationDialog/>
        </Suspense>}
      {isNewGroup && <Suspense fallback={<Backdrop open/>}>
        <NewGroupDialog/>
        </Suspense>}
    </>
  );
}

{
  /*tool tip show the name new group when we hover over it*/
}
const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inhert" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;