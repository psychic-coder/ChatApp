import { Outlet } from 'react-router-dom';
import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectRoute({children,user,redirect="/login"}) {
  
   if(!user){
    return <Navigate to={redirect}/>
   }
   else
   return children ? children:<Outlet/>;
  
}

export default ProtectRoute