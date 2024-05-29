import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

//createApi is a function that generates a Redux slice for managing API calls and caching. It provides a standardized way to define endpoints, handle API requests, and manage caching and re-fetching of data.
//overhere we create endpoints and export them as hooks
const api = createApi({
  reducerPath: "api", // unique key to store reducer state
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User"],

  //query is for get request
  //mutation is for the post , or update data
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: `/user/sendrequest`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    /*keepUnusedDataFor controls the duration that cached data remains in the store after it is no longer actively used by any component.
Setting keepUnusedDataFor to 0 ensures the data is removed from the cache immediately after it becomes unused*/
    getNotifications: builder.query({
      query: () => ({
        url: `user/notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
} = api;
