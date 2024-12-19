import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Container,
  Header,
  Segment,
  Button,
  Image, // Add this line
} from "semantic-ui-react";
import { Link } from "react-router-dom";
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
};

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
  </MediaContextProvider>
);

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
        const response = await axios.get(`${API_BASE_URL}/dataapi/quizzes/`);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching course data");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
                    course.title + "simple vector"
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

export default Courses;
