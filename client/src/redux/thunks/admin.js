import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";


///createAsyncThunk is a utility provided by Redux Toolkit that allows you to handle asynchronous logic (like API calls) within Redux. It simplifies the process of dispatching actions based on the lifecycle of an async operation (pending, fulfilled, rejected).




/*Standard Async Actions: Used for typical async operations where you need to dispatch actions for loading, success, and error states.
Flexibility: Offers more control over the async logic, suitable for complex scenarios.
Integration: Can be integrated into your existing reducers and slices.
*/
const adminLogin=createAsyncThunk("admin/login",async(secretKey)=>{
try {
    
    const config={
        withCredentials:true,
        header:{
            "Content-type":"application/json",
        }
    }

    const {data}=await axios.post(`${server}/api/v1/admin/verify`,{secretKey},config);

    return data.message;
} catch (error) {
    throw error.reponse.data.message;
}
})
const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/`, {
        withCredentials: true,
      });
  
      return data.admin;
    } catch (error) {
      throw error.response.data.message;
    }
  });
  
  const adminLogout = createAsyncThunk("admin/logout", async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
        withCredentials: true,
      });
  
      return data.message;
    } catch (error) {
      throw error.response.data.message;
    }
  });
  
  export { adminLogin, getAdmin, adminLogout };