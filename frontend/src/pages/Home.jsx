// src/components/HomepageLayout.jsx
import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { InView } from "react-intersection-observer";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import noddleLogo from "../pages/images/noddlelogo.png"; // Import logo
import examsImage from "../pages/images/exams.jpg"; // Import exams image

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

// HomepageHeading Component
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as="h1"
      content="Welcome to Noddle.org"
      inverted
      style={{
        fontSize: mobile ? "2em" : "4em",
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: mobile ? "1.5em" : "3em",
      }}
    />
    <Header
      as="h2"
      content="A learning platform and online exams run by future!"
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em",
      }}
    />
    <Button as={Link} to="/exams" primary size="huge">
      Take exams now!
      <Icon name="right arrow" />
    </Button>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

// DesktopContainer Component
class DesktopContainer extends React.Component {
  state = {
    fixed: false,
  };

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

  render() {
    const { children, isLoggedIn, username } = this.props; // Destructure props
    const { fixed } = this.state;

    return (
      <Media greaterThan="mobile">
        <InView onChange={this.toggleFixedMenu}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 700, padding: "1em 0em" }}
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
                <Menu.Item as={Link} to="/" active>
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/courses">
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
                        <Icon name="user" /> Hello, {username}!
                      </Menu.Item>
                      <Button
                        as={Link}
                        to="/logout"
                        inverted={!fixed}
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
            <HomepageHeading />
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

// ResponsiveContainer Component
const ResponsiveContainer = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "";

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
          const response = await axios.get(
            `${API_BASE_URL}/api/user/`,
            config
          );
          setLoggedIn(true);
          setUsername(response.data.username);
          console.log("Logged in as:", response.data.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        setLoggedIn(false);
        setUsername("");
        console.error("Error fetching user data:", error);
      }
    };
    checkLoggedInUser();
  }, [API_BASE_URL]);

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

// HomepageLayout Component
const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Building the future of learning!
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              Noddle.org is a solid learning platform and environment for
              securely taking online exams.
            </p>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Every exam is highly secure and sophisticatedly monitored by
              computer vision
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              Brightening the exams process with advanced AI Assessment tools, be
              it for learning or for exams.
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Image
              bordered
              rounded
              size="large"
              src={examsImage}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Button as={Link} to="/learn-more" size="huge">
              Learn more
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "0em" }} vertical>
      <Grid celled="internally" columns="equal" stackable>
        <Grid.Row textAlign="center">
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Courses
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              That are highly flexible and automated courses for all levels of
              learners.
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Computer Vision
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              <b>Exams that</b> are monitored by AI to detect cheating and
              plagiarism.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text>
        <Header as="h3" style={{ fontSize: "2em" }}>
          Smart learning, quizzes, and assessments
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Gone are the days of taking quizzes and assessments on paper! Tired of
          waiting for the papers to be checked by the teacher? Noddle.org is
          here to help you!
        </p>
        <Button as={Link} to="/how-it-works" size="large">
          Read more on how it's done
        </Button>

        <Divider
          as="h4"
          className="header"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        >
          <Link to="/home">Take me home</Link>
        </Divider>

        <Header as="h3" style={{ fontSize: "2em" }}>
          Computer Vision
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          How does AI monitor exams and proctor excellently?
        </p>
        <Button as={Link} to="/ai-monitoring" size="large">
          Learn more
        </Button>
      </Container>
    </Segment>

    <Segment inverted vertical style={{ padding: "5em 0em" }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="About" />
              <List link inverted>
                <List.Item as={Link} to="/sitemap">
                  Sitemap
                </List.Item>
                <List.Item as={Link} to="/contact">
                  Contact Us
                </List.Item>
                <List.Item as={Link} to="/info">
                  More info
                </List.Item>
                <List.Item as={Link} to="/project">
                  Final Year Project BCU
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Services" />
              <List link inverted>
                <List.Item as={Link} to="/report-issue">
                  Report an issue
                </List.Item>
                <List.Item as={Link} to="/faq">
                  FAQ
                </List.Item>
                <List.Item as={Link} to="/hire">
                  Hire me
                </List.Item>
                <List.Item as={Link} to="/please">
                  Please
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as="h4" inverted>
                Final Year Project Sample Site for BCU
              </Header>
              <p>
                An ambitious project that will reflect the learning capabilities
                of the creator.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
);

export default HomepageLayout;
