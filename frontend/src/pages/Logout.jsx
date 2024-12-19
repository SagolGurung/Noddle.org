// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
