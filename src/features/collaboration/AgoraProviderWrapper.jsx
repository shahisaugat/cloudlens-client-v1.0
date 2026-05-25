import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

// Initialize the Agora Client
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const AgoraProviderWrapper = ({ children }) => {
  return (
    <AgoraRTCProvider client={client}>
      {children}
    </AgoraRTCProvider>
  );
};
