import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Home from "./features/pages/Home";
import Login from "./features/pages/auth/Login.jsx";
import Signup from "./features/pages/auth/Signup.jsx";
import Dashboard from "./features/pages/Dashboard.jsx";
import ChatFAB from "./components/ui/ChatFAB.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import OAuth2RedirectHandler from "./features/pages/auth/OAuth2RedirectHandler.jsx";
import { AgoraProviderWrapper } from "./features/collaboration/AgoraProviderWrapper.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AgoraProviderWrapper>
                <Dashboard />
              </AgoraProviderWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ChatFAB />
    </>
  );
}
