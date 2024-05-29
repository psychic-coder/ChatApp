import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../../../redux/reducers/misc";
import { AudioFile as AudioFileIcon, Image as ImageIcon,UploadFile as UploadFileIcon ,VideoFile as VideoFileIcon } from "@mui/icons-material";
/*The anchorEl attribute in the Menu component of Material-UI is used to set the element that the menu should be anchored to. It determines the position and placement of the menu relative to the anchored element.
When you open a menu in Material-UI, you typically have an element (such as a button or an icon) that the user interacts with to trigger the opening of the menu. The anchorEl prop is used to pass a reference to that triggering element, so that the menu can be positioned correctly in relation to it.*/

const FileMenu = ({ anchorE1 }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const closeFileMenu = () => dispatch(setIsFileMenu(false));
    const fileChangeHandler=(e,key)=>{

    }
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png ,image/jpeg ,image/gif"
              style={{ display: "none" }}
              onChange={(e)=>fileChangeHandler(e,"Images")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e)=>fileChangeHandler(e,"Audios")}
            />
          </MenuItem>


          <MenuItem >
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
          
            />
          </MenuItem>
   
          <MenuItem >
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
             
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
