import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Container, Header, Segment, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createMedia } from "@artsy/fresnel";
import { InView } from "react-intersection-observer";
import { Menu } from "semantic-ui-react";

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
                <Menu.Item as={Link} to="/courses">
                  Courses
                </Menu.Item>
                <Menu.Item as={Link} to="/exams" active>
                  Exams
                </Menu.Item>
                <Menu.Item as={Link} to="/assessments">
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

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch exam data from the backend
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/dataapi/quizzes/"
        );
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching exam data");
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return <p>Loading exams...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ResponsiveContainer>
      <Segment vertical style={{ padding: "8em 0em" }}>
        <Header as="h2" textAlign="center" style={{ fontSize: "3em" }}>
          Available Exams
        </Header>
        <Container>
          <Card.Group itemsPerRow={3} stackable>
            {exams.map((exam) => (
              <Card key={exam.id} raised>
                <Card.Content>
                  <Card.Header>{exam.title}</Card.Header>
                  <Card.Description>{exam.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button as={Link} to={`/quiz/${exam.id}`} primary>
                    Start Exam
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

export default Exams;
