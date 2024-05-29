import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/styles/auth/ProtectRoute";
import { LayoutLoader } from "./components/styles/layout/Loaders";
import axios from "axios";
import { server } from "../src/constants/config.js";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";

//react-hot-toast is a lightweight and customizable toast notification library for React applications. It allows you to display temporary messages or alerts to users, providing feedback or notifications about various events in the application, such as form submissions, errors, success messages, and more.

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Groups = lazy(() => import("./pages/Groups"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

function App() {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              //as we want to access sockets inside the home,chat and group so we wrapped it around here
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />

          {/*fo any random route page we go to the notfound page*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/*This component will render all toasts. */}
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

/*Performance Optimization: By loading components only when needed, you reduce the initial load time and improve the performance of your application.
Code Splitting: It helps in splitting the code into smaller chunks, which can be loaded on demand.
Improved User Experience: Users can see the initial content faster, and subsequent content is loaded as needed.*/

export default App;
