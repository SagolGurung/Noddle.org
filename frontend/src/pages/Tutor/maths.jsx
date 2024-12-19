import React, { useState } from "react";
import {
  Container,
  Segment,
  Header,
  Form,
  Button,
  Icon,
  List,
} from "semantic-ui-react";
import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Utility function to parse and format the response
const formatResponse = (response) => {
  const lines = response.split("\n");

  return lines.map((line, index) => {
    if (line.startsWith("**")) {
      return (
        <Header as="h4" key={index} style={{ marginTop: "1em" }}>
          {line.replace(/\*\*/g, "")}
        </Header>
      );
    } else if (line.startsWith("```")) {
      return (
        <Segment
          key={index}
          inverted
          style={{ fontFamily: "monospace", padding: "0.5em" }}
        >
          {line.replace(/```/g, "")}
        </Segment>
      );
    } else if (line.startsWith("*")) {
      return <List.Item key={index}>{line.replace("* ", "")}</List.Item>;
    } else {
      return <p key={index}>{line}</p>;
    }
  });
};

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
                <Menu.Item as={Link} to="/courses" >
                  Courses
                </Menu.Item>
                <Menu.Item as={Link} to="/exams">
                  Exams
                </Menu.Item>
                <Menu.Item as={Link} to="/mathsask" active>
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

function MathQuestion() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch(`${API_BASE_URL}/api/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!result.ok) {
        throw new Error(`Error: ${result.statusText}`);
      }

      const data = await result.json();
      setResponse(data.response || "No response received.");
      setError(null);
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to fetch the response. Please try again.");
      setResponse("");
    }
  };

  return (
    <ResponsiveContainer>
      <Container style={{ marginTop: "2em" }}>
        <Segment raised style={{ padding: "2em" }}>
          <Header as="h2" icon textAlign="center">
            <Icon name="question circle" />
            Let me help you with Maths!
          </Header>
          <Form onSubmit={handleSubmit} style={{ marginTop: "1em" }}>
            <Form.Input
              fluid
              placeholder="Type your math question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button primary type="submit" fluid style={{ marginTop: "1em" }}>
              Submit Question
            </Button>
          </Form>
          {error && (
            <Segment color="red" style={{ marginTop: "1em" }}>
              <Header as="h4" style={{ color: "red" }}>
                {error}
              </Header>
            </Segment>
          )}
          {response && (
            <Segment style={{ marginTop: "2em" }}>
              <Header as="h3">Response:</Header>
              <List>{formatResponse(response)}</List>
            </Segment>
          )}
        </Segment>
      </Container>
    </ResponsiveContainer>
  );
}

export default MathQuestion;
