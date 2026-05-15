# 🚀 ChatterBox - Real-Time Chat Application

ChatterBox is a feature-rich, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It supports one-on-one and group chats, file sharing, and includes a comprehensive Admin Dashboard.

**Live Frontend URL:** [https://chat-app-kappa-bice.vercel.app](https://chat-app-kappa-bice.vercel.app)

---

## ✨ Features

### 👤 User Features
- **Authentication**: Secure Login and Signup with Avatar uploads.
- **Real-Time Messaging**: Instant chat capability using Socket.io.
- **Group Chats**: Create groups, add/remove members, and manage group settings.
- **File Sharing**: Upload and send attachments (images, etc.) via Cloudinary.
- **Friend System**: Send, accept, or reject friend requests.
- **Notifications**: Real-time alerts for messages and friend requests.
- **Profile Management**: View your profile and bio.

### 🛡️ Admin Features
- **Dashboard**: Visualized data charts showing user and message statistics.
- **User Management**: Monitor and manage all registered users.
- **Chat Management**: Overview of all active one-on-one and group chats.
- **Message Management**: Track and manage all messages sent across the platform.

---

## 🛠️ Tech Stack

- **Frontend**: React, Material UI (MUI), Redux Toolkit, Framer Motion, Chart.js.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **File Storage**: Cloudinary.
- **Hosting**: Vercel (Frontend), Render (Backend).

---

## 🔑 Environment Variables

### Backend (`/Backend/.env`)
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=supersecretadminkey
NODE_ENV=PRODUCTION
CLIENT_URL=https://chat-app-kappa-bice.vercel.app

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`/client/.env`)
```env
VITE_SERVER=https://your-backend-url.onrender.com
```

---

## 🔐 Admin Panel Access

The application includes a restricted Admin Panel for platform oversight.

- **Admin Login Route**: `https://chat-app-kappa-bice.vercel.app/admin`
- **Secret Key**: `supersecretadminkey`

Once logged in, you can access the Dashboard at `/admin/dashboard`.

---

## 🚀 Deployment Instructions

### Backend (Render)
1. Set Root Directory to `Backend`.
2. Build Command: `npm install`.
3. Start Command: `npm start`.
4. Add all Environment Variables.

### Frontend (Vercel)
1. Set Root Directory to `client`.
2. Add `VITE_SERVER` as an Environment Variable.
3. Ensure `vercel.json` is present for SPA routing.

---

## 👨‍💻 Author
**Rohit Ganguly**
