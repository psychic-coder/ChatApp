import React, { useEffect, useState } from 'react'
import AdminLayout from "../../components/styles/layout/AdminLayout"
import Table from '../../components/styles/shared/Table';
import { Avatar } from '@mui/material';
import { dashboardData } from '../../constants/SampleData';
import {transformImage} from '../../lib/features'


const columns=[{
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:200,

},
{
  field:"avatar",
  headerName:"Avatar",
  headerClassName:"table-header",
  width:150,
  //the below line is preventing us from just showing the image address, its mutating it show all that data
  renderCell:(paramas)=><Avatar alt={paramas.row.name} src={paramas.row.avatar}/>
},
{
  field:"name",
  headerName:"Name",
  headerClassName:"table-header",
  width:200,

},
{
  field:"username",
  headerName:"Username",
  headerClassName:"table-header",
  width:200,

},
{
  field:"friends",
  headerName:"Friends",
  headerClassName:"table-header",
  width:150,

},
{
  field:"groups",
  headerName:"Groups",
  headerClassName:"table-header",
  width:200,

},

];
const UserManagement = () => {
const [rows,setRows]=useState([]);
useEffect(()=>{
setRows(dashboardData.users.map((i)=>({...i,id:i._id,avatar:transformImage(i.avatar,50)})))
},[])
  return (
   <AdminLayout>
       <Table heading={"All Users"} columns={columns} rows={rows}> 

       </Table>
   </AdminLayout>
  )
}

export default UserManagement