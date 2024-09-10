import React, { useState } from "react";
import axios from "axios";
import { Button } from "semantic-ui-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "", // Changed from 'name' to 'username'
    email: "",
    password1: "",
    password2: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );
      console.log("Success!", response.data);
      setSuccessMessage("Registered Successfully!");
      setError(null);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data)
          .flat()
          .join(", ");
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <h2>Register:</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <br />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <br />
        <label>Email:</label>
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <label>Password:</label>
        <br />
        <input
          type="password"
          name="password1"
          value={formData.password1}
          onChange={handleChange}
        />
        <br />
        <label>Confirm Password:</label>
        <br />
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
        />
        <br />
        <br />
        <Button type="submit" primary loading={isLoading} disabled={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
}
