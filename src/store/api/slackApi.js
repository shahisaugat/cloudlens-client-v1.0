import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const slackApi = createApi({
  reducerPath: "slackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/slack",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["SlackConfig"],
  endpoints: (builder) => ({
    disconnectSlack: builder.mutation({
      query: () => ({
        url: "/disconnect",
        method: "DELETE",
      }),
      invalidatesTags: ["SlackConfig", "Integrations"],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.info("LOG: Disconnecting Slack...");
        try {
          await queryFulfilled;
          console.info("LOG: Slack disconnected successfully");
        } catch (err) {
          console.error("LOG: Slack disconnect failed", err);
        }
      },
    }),
  }),
});

export const { useDisconnectSlackMutation } = slackApi;
