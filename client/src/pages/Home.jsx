import React from 'react'
import AppLayout from '../components/styles/layout/AppLayout'
import { Typography } from "@mui/material";

const Home = () => {
  return (
    
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Home
      </Typography>
    
  );
};

export default AppLayout()(Home)