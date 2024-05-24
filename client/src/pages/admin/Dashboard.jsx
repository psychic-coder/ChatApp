import React from "react";
import AdminLayout from "../../components/styles/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { AdminPanelSettings as AdminPanelSettingsIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import moment from "moment";
import { SearchField,CurveButton } from "../../styles/StyledComponent";

const Dashboard = () => {
  const AppBar = (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon
          sx={{
            fontSize: "3rem",
          }}
        />
        <SearchField type="text" placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1}/>
        <Typography display={{
          xs:"none",
          lg:"block"
        }}
        color={"rgba(0,0,0,0.7)"}
        textAlign={"center"}
        >{moment().format("dddd, D MMMM YYYY")}</Typography>
        <NotificationsIcon/>
      </Stack>
    </Paper>
  );
  return (
    <AdminLayout>
      <Container component={"main"}>{AppBar}
      
      
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
