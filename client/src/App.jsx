import React,{lazy} from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"

const Home=lazy(()=>import("./pages/Home"))
const Login=lazy(()=>import("./pages/Login"))
const Groups=lazy(()=>import("./pages/Groups"))
const Chat=lazy(()=>import("./pages/Chat"))



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />   
        <Route path="/groups" element={<Groups/>} />  
        <Route path="/chat/:chatId" element={<Chat/>} />  
        <Route path="/login" element={<Login/>} />  
      </Routes>
    </BrowserRouter>
  )
}

/*Performance Optimization: By loading components only when needed, you reduce the initial load time and improve the performance of your application.
Code Splitting: It helps in splitting the code into smaller chunks, which can be loaded on demand.
Improved User Experience: Users can see the initial content faster, and subsequent content is loaded as needed.*/ 

export default App