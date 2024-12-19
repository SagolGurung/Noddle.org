// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import noddleLogo from "../pages/images/noddlelogo.png";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Removed isLoggedIn state as navigation handles it
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password,
      });
      console.log("Login success!", response.data);
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      setError(null);
      navigate("/home"); // Redirect after successful login
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data)
          .flat()
          .join(", ");
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh", backgroundColor: "#f1f0ff" }}
      verticalAlign="middle"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="black" textAlign="center">
          <Image src={noddleLogo} style={{ mixBlendMode: "divide" }} /> Welcome
          to Noddle.org
        </Header>
        <Form size="large" onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              color="black"
              fluid
              size="large"
              loading={isLoading}
              disabled={isLoading}
              type="submit"
            >
              Login
            </Button>
            {error && <Message error content={error} />}
            {/* Optionally, remove the success message as navigation occurs */}
            {/* {isLoggedIn && <Message success content="Login Successful!" />} */}
          </Segment>
        </Form>
        <Message>
          New to us? <Link to="/register">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
