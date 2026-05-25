import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { githubApi } from "./api/githubApi";
import { slackApi } from "./api/slackApi";
import { meetingApi } from "./api/meetingApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,
    [slackApi.reducerPath]: slackApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      githubApi.middleware,
      slackApi.middleware,
      meetingApi.middleware
    ),
});
