// src/components/Courses.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Container,
  Header,
  Segment,
  Button,
  Image,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createMedia } from "@artsy/fresnel";
import { InView } from "react-intersection-observer";
import { Menu } from "semantic-ui-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

class DesktopContainer extends React.Component {
  state = {};

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

  render() {
    const { children, isLoggedIn, username } = this.props;
    const { fixed } = this.state;

    return (
      <Media greaterThan="mobile">
        <InView onChange={this.toggleFixedMenu}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 100, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item as={Link} to="/">
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/courses" active>
                  Courses
                </Menu.Item>
                <Menu.Item as={Link} to="/exams">
                  Exams
                </Menu.Item>
                <Menu.Item as={Link} to="/mathsask">
                  Smart Assessment
                </Menu.Item>
                <Menu.Item position="right">
                  {isLoggedIn ? (
                    <>
                      <Menu.Item>
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            username
                          )}&background=random&size=32`}
                          avatar
                          spaced="right"
                          alt={username}
                        />
                        Hello, {username}!
                      </Menu.Item>
                      <Button
                        as={Link}
                        to="/logout"
                        inverted={!fixed}
                        style={{ marginLeft: "0.5em" }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button as={Link} to="/login" inverted={!fixed}>
                        Log in
                      </Button>
                      <Button
                        as={Link}
                        to="/register"
                        inverted={!fixed}
                        primary={fixed}
                        style={{ marginLeft: "0.5em" }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </InView>
        {children}
      </Media>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

const ResponsiveContainer = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${API_BASE_URL}/api/user/`, config);
          setLoggedIn(true);
          setUsername(response.data.username);
          console.log("Logged in as:", response.data.username);
        } else {
          setLoggedIn(false);
          setUsername("");
          navigate("/login"); // Redirect to login if not authenticated
        }
      } catch (error) {
        setLoggedIn(false);
        setUsername("");
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login on error
      }
    };
    checkLoggedInUser();
  }, [navigate]);

  return (
    <MediaContextProvider>
      <DesktopContainer isLoggedIn={isLoggedIn} username={username}>
        {children}
      </DesktopContainer>
      {/* Uncomment and implement MobileContainer if needed */}
      {/* <MobileContainer
        isLoggedIn={isLoggedIn}
        username={username}
      >
        {children}
      </MobileContainer> */}
    </MediaContextProvider>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch course data from the backend
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // If no token, redirect to login
          throw new Error("No access token found");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${API_BASE_URL}/dataapi/quizzes/`, config);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, redirect to login
          console.error("Unauthorized access - redirecting to login.");
          window.location.href = "/login";
        } else {
          setError("Error fetching course data");
        }
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <ResponsiveContainer>
        <Segment vertical style={{ padding: "8em 0em" }}>
          <Header as="h2" textAlign="center" style={{ fontSize: "3em" }}>
            Loading courses...
          </Header>
        </Segment>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer>
        <Segment vertical style={{ padding: "8em 0em" }}>
          <Header as="h2" textAlign="center" color="red" style={{ fontSize: "3em" }}>
            {error}
          </Header>
        </Segment>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <Segment vertical style={{ padding: "8em 0em" }}>
        <Header as="h2" textAlign="center" style={{ fontSize: "3em" }}>
          Available Courses
        </Header>
        <Container>
          <Card.Group itemsPerRow={3} stackable>
            {courses.map((course) => (
              <Card key={course.id} raised>
                <Image
                  src={`https://pollinations.ai/p/${encodeURIComponent(
                    course.title + " simple vector"
                  )}`}
                  alt={course.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header>{course.title}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Button as={Link} to={`/quiz/${course.id}`} primary>
                    View Course
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </Segment>
    </ResponsiveContainer>
  );
};

Courses.propTypes = {
 
};

export default Courses;
