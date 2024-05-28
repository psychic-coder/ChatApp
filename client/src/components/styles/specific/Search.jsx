import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../../redux/reducers/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../../redux/api/api";
import {toast} from "react-hot-toast"
import { useAsyncMutation } from "../../../hooks/hook";

/*Debouncing in React (or any JavaScript application) is a technique used to limit the rate at which a function is executed. It ensures that the function is only called once after a specified period of time has elapsed since the last time it was invoked. This is particularly useful for performance optimization, especially in scenarios where a function might be called frequently, such as user input events (e.g., typing in a search box, resizing a window, scrolling, etc.).*/

function Search() {
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();
  const [executeMutation,isLoadingSendFriendRequest,isLoading]=useAsyncMutation(useSendFriendRequestMutation);

  
  const [users, setUsers] = useState([]);
  const addFriendHandler = async (id) => {
  await  executeMutation("Sending friend request ...",{userId:id})

  };
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          return setUsers(data.users)})
        .catch((e) => console.log(e));
    }, 1000);
    //The clearTimeout function in JavaScript is used to cancel a timeout that was previously established by calling setTimeout. When you use setTimeout to schedule a function to be executed after a certain delay, setTimeout returns a timeout ID. This ID can be passed to clearTimeout to prevent the scheduled function from being executed.
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
       <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
}

export default Search;
