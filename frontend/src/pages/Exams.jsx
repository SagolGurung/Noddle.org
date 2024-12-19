// src/components/Exams.jsx

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Container,
  Header,
  Segment,
  Button,
  Image,
  Menu,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createMedia } from "@artsy/fresnel";
import { InView } from "react-intersection-observer";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

// DesktopContainer Component with Authentication Props
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
                <Menu.Item as={Link} to="/courses">
                  Courses
                </Menu.Item>
                <Menu.Item as={Link} to="/exams" active>
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

// ResponsiveContainer Component Handling Authentication
const ResponsiveContainer = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); // For navigation on auth failure
  const [loadingAuth, setLoadingAuth] = useState(true); // To handle auth loading state

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
      } finally {
        setLoadingAuth(false);
      }
    };
    checkLoggedInUser();
  }, [navigate]);

  if (loadingAuth) {
    // Optionally, display a loading indicator while checking auth
    return (
      <Container textAlign="center" style={{ marginTop: "2em" }}>
        <Header as="h2">Loading...</Header>
      </Container>
    );
  }

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

// Exams Component with Authentication
const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraDenied, setCameraDenied] = useState(false); // Track camera denial state
  const videoRef = useRef(null);
  const navigate = useNavigate(); // For navigation on unauthorized access

  useEffect(() => {
    const fetchExams = async () => {
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
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, redirect to login
          console.error("Unauthorized access - redirecting to login.");
          navigate("/login");
        } else {
          setError("Error fetching exam data");
        }
        setLoading(false);
      }
    };
    fetchExams();
  }, [navigate]);

  const handleStartExam = async (examId) => {
    const userAccepted = window.confirm(`
      Exam Instructions:
      - Please remain in a clear background with only your face towards the camera.
      - No unauthorized materials allowed.

      Note: The data recorded will be for institutional purposes only and will not be shared elsewhere.

      Press OK to continue.
    `);

    if (userAccepted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // If permission granted, navigate to the quiz page
        navigate(`/quiz/${examId}`);
      } catch (err) {
        alert("Camera access is required to start the exam. Exam halted.");
        setCameraDenied(true);
      }
    }
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <Segment vertical style={{ padding: "8em 0em" }}>
          <Header as="h2" textAlign="center" style={{ fontSize: "3em" }}>
            Loading exams...
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
          Available Exams
        </Header>
        {cameraDenied && (
          <Container textAlign="center" style={{ marginTop: "2em" }}>
            <Segment
              padded="very"
              style={{ border: "2px solid red", background: "#f8d7da" }}
            >
              <Header as="h2" style={{ color: "red" }}>
                Exam Halted
              </Header>
              <p>Camera access is required to proceed with the exam.</p>
            </Segment>
          </Container>
        )}
        <Container>
          <Card.Group itemsPerRow={3} stackable>
            {exams.map((exam) => (
              <Card key={exam.id} raised>
                <Card.Content>
                  <Card.Header>{exam.title}</Card.Header>
                  <Card.Description>{exam.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button primary onClick={() => handleStartExam(exam.id)}>
                    Start Exam
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </Segment>
      <video ref={videoRef} style={{ display: "none" }}></video>
    </ResponsiveContainer>
  );
};

Exams.propTypes = {
  
};

export default Exams;
