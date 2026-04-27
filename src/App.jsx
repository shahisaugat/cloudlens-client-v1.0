import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Home from "./features/pages/Home";
import Login from "@/features/pages/auth/Login.jsx";
import Signup from "@/features/pages/auth/Signup.jsx";
import ChatFAB from "./components/ui/ChatFAB.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ChatFAB />
    </>
  );
}
