import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const meetingApi = createApi({
  reducerPath: "meetingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/meetings",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Meeting"],
  endpoints: (builder) => ({
    getMeetings: builder.query({
      query: () => "",
      providesTags: ["Meeting"],
    }),
    getMeetingByRoom: builder.query({
      query: (roomId) => `/room/${roomId}`,
      providesTags: (result, error, arg) => [{ type: "Meeting", id: arg }],
    }),
    createOrUpdateMeeting: builder.mutation({
      query: (meeting) => ({
        url: "",
        method: "POST",
        body: meeting,
      }),
      invalidatesTags: ["Meeting"],
    }),
    updateMeetingControls: builder.mutation({
      query: ({ meetingId, controls }) => ({
        url: `/${meetingId}/controls`,
        method: "PUT",
        body: controls,
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        "Meeting",
        { type: "Meeting", id: meetingId }
      ],
    }),
    deleteMeeting: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meeting"],
    }),
    joinRoom: builder.mutation({
      query: ({ roomId, micOn, cameraOn }) => ({
        url: `/room/${roomId}/join?micOn=${micOn}&cameraOn=${cameraOn}`,
        method: "POST",
      }),
      invalidatesTags: ["Meeting"],
    }),
    leaveRoom: builder.mutation({
      query: (roomId) => ({
        url: `/room/${roomId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Meeting"],
    }),
    updateParticipantStatus: builder.mutation({
      query: ({ roomId, micOn, cameraOn }) => ({
        url: `/room/${roomId}/participant-status?micOn=${micOn}&cameraOn=${cameraOn}`,
        method: "PUT",
      }),
      invalidatesTags: ["Meeting"],
    }),
    requestToJoin: builder.mutation({
      query: (roomId) => ({
        url: `/room/${roomId}/request-join`,
        method: "POST",
      }),
    }),
    approveJoin: builder.mutation({
      query: ({ roomId, email }) => ({
        url: `/room/${roomId}/approve-join?email=${encodeURIComponent(email)}`,
        method: "PUT",
      }),
      invalidatesTags: ["Meeting"],
    }),
    denyJoin: builder.mutation({
      query: ({ roomId, email }) => ({
        url: `/room/${roomId}/deny-join?email=${encodeURIComponent(email)}`,
        method: "PUT",
      }),
      invalidatesTags: ["Meeting"],
    }),
    getMyRequestStatus: builder.query({
      query: (roomId) => `/room/${roomId}/my-request-status`,
    }),
  }),
});

// Utility to fetch Agora RTC token from backend token server
export const fetchAgoraToken = async (channelName, uid, jwtToken) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/agora/token?channelName=${encodeURIComponent(channelName)}&uid=${uid}`,
      {
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || null;
  } catch (err) {
    console.error("Failed to fetch Agora token:", err);
    return null;
  }
};

export const {
  useGetMeetingsQuery,
  useGetMeetingByRoomQuery,
  useCreateOrUpdateMeetingMutation,
  useUpdateMeetingControlsMutation,
  useDeleteMeetingMutation,
  useJoinRoomMutation,
  useLeaveRoomMutation,
  useUpdateParticipantStatusMutation,
  useRequestToJoinMutation,
  useApproveJoinMutation,
  useDenyJoinMutation,
  useGetMyRequestStatusQuery,
} = meetingApi;
