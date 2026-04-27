import React from "react";
import { Routes, Route } from "react-router-dom";
import "./shared/styles/index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatFAB from "./components/ChatFAB";

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
