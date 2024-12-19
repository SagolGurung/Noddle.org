import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Card, Container, Header, Segment, Button, Menu } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom"; // Updated: useNavigate
import axios from "axios";
import { createMedia } from "@artsy/fresnel";
import { InView } from "react-intersection-observer";

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
    const { children } = this.props;
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
                <Menu.Item as={Link} to="/">Home</Menu.Item>
                <Menu.Item as={Link} to="/courses">Courses</Menu.Item>
                <Menu.Item as={Link} to="/exams" active>Exams</Menu.Item>
                <Menu.Item as={Link} to="/mathsask">Smart Assessment</Menu.Item>
                <Menu.Item position="right">
                  <Button as={Link} to="/login" inverted={!fixed}>Log in</Button>
                  <Button as={Link} to="/register" inverted={!fixed} primary={fixed} style={{ marginLeft: "0.5em" }}>
                    Sign up
                  </Button>
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

DesktopContainer.propTypes = { children: PropTypes.node };

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = { children: PropTypes.node };

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraDenied, setCameraDenied] = useState(false); // Track camera denial state
  const videoRef = useRef(null);
  const navigate = useNavigate(); // Updated: useNavigate for navigation

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dataapi/quizzes`);
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching exam data: " + error.message);
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

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
        navigate(`/quiz/${examId}`); // Updated: useNavigate for redirection
      } catch (err) {
        alert("Camera access is required to start the exam. Exam halted.");
        setCameraDenied(true);
      }
    }
  };

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ResponsiveContainer>
      <Segment vertical style={{ padding: "8em 0em" }}>
        <Header as="h2" textAlign="center" style={{ fontSize: "3em" }}>
          Available Exams
        </Header>
        {cameraDenied && (
          <Container textAlign="center" style={{ marginTop: "2em" }}>
            <Segment padded="very" style={{ border: "2px solid red", background: "#f8d7da" }}>
              <Header as="h2" style={{ color: "red" }}>Exam Halted</Header>
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

export default Exams;
