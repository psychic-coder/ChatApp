import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/styles/layout/AdminLayout";
import Table from "../../components/styles/shared/Table";
import { Avatar, Box, Stack } from "@mui/material";
import { dashboardData } from "../../constants/SampleData";
import { FileFormat as fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import RenderAttachment from "../../components/styles/shared/RenderAttachment";
import {motion} from "framer-motion"
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box>
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 150,
    // the below line is preventing us from just showing the image address, it's mutating it to show all that data
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {

  const { loading, data, error, refetch } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messsages"
  );
  useErrors([{ isError: error, error: error }]);




  const [rows, setRows] = useState([]); // Moved the useState hook inside the component
  useEffect(() => {
    if(data){
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Messages"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
