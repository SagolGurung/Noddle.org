import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import React, { Component, useState, useEffect } from "react";
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
  Sidebar,
} from "semantic-ui-react";

import { Link } from "react-router-dom";
import axios from "axios";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as="h1"
      content="Welcome Noddle.org"
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
      content="A learning platform and online exams run by AI teachers"
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

class DesktopContainer extends Component {
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
                <Menu.Item as={Link} to="" active>
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/courses">
                  Courses
                </Menu.Item>
                <Menu.Item as={Link} to="/exams">
                  Exams
                </Menu.Item>
                <Menu.Item as={Link} to="">
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
                    Sign in
                  </Button>
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
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as={Link} to="" active>
              Home
            </Menu.Item>
            <Menu.Item as={Link} to="">
              Courses
            </Menu.Item>
            <Menu.Item as={Link} to="">
              Exams
            </Menu.Item>
            <Menu.Item as={Link} to="">
              Smart Assessment
            </Menu.Item>
            <Menu.Item as={Link} to="">
              Log in
            </Menu.Item>
            <Menu.Item as={Link} to="">
              Sign Up
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign="center"
              style={{ minHeight: 350, padding: "1em 0em" }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as={Link} to="" inverted>
                      Log in
                    </Button>
                    <Button
                      as={Link}
                      to=""
                      inverted
                      style={{ marginLeft: "0.5em" }}
                    >
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  // const navigate = useNavigate();

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
            "http://127.0.0.1:8000/api/user/",
            config
          );
          setLoggedIn(true);
          setUsername(response.data.username);
          console.log(response.data.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser();
  }, []);

  return (
    <MediaContextProvider>
      <DesktopContainer
        isLoggedIn={isLoggedIn}
        username={username}

        // handleLogout={handleLogout}
      >
        {children}
      </DesktopContainer>
      <MobileContainer
        isLoggedIn={isLoggedIn}
        username={username}
        // handleLogout={handleLogout}
      >
        {children}
      </MobileContainer>
    </MediaContextProvider>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

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
              Every exams is highly secure and sophisticatedly monitored by
              computer vision
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              Brightening the exams process with advance AI Assessment tools, be
              it for learning or for exams.
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Image
              bordered
              rounded
              size="large"
              src={require("../pages/images/exams.jpg")}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Button as={Link} to="" size="huge">
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
              Computer vision
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
          Smart learning, quizes and assessments
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Gone are the days of taking quizes and assessments in papers! Tired of
          waiting for the papers to be checked by the teacher? Noddle.org is
          here to help you!
        </p>
        <Button as={Link} to="/home" size="large">
          Read more on how its done
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
          How does AI monitior exams and proctor excellently?
        </p>
        <Button as={Link} to="" size="large">
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
                <List.Item as={Link} to="">
                  Sitemap
                </List.Item>
                <List.Item as={Link} to="">
                  Contact Us
                </List.Item>
                <List.Item as={Link} to="">
                  More info
                </List.Item>
                <List.Item as={Link} to="">
                  Final year project BCU
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Services" />
              <List link inverted>
                <List.Item as={Link} to="">
                  Report an issue
                </List.Item>
                <List.Item as={Link} to="">
                  FAQ
                </List.Item>
                <List.Item as={Link} to="">
                  Hire me
                </List.Item>
                <List.Item as={Link} to="">
                  Please
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as="h4" inverted>
                Final year project sample site for BCU
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
