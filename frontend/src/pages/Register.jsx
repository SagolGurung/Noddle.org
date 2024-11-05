import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
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
    e.preventDefault();
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
    <Grid
      textAlign="center"
      style={{ height: "100vh", backgroundColor: "#9C9BA9" }} // bg color is here
      verticalAlign="middle"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          Register Account
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm Password"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
            <Button
              color="black"
              fluid
              size="large"
              loading={isLoading}
              disabled={isLoading}
            >
              Register
            </Button>
          </Segment>
        </Form>
        {error && <Message error content={error} />}
        {successMessage && <Message success content={successMessage} />}
      </Grid.Column>
    </Grid>
  );
}
