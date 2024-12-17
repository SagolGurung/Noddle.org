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

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Utility function to parse and format the response
const formatResponse = (response) => {
  const lines = response.split("\n"); // Split response into lines

  return lines.map((line, index) => {
    if (line.startsWith("**")) {
      // Bold lines (e.g., **Step 1**)
      return (
        <Header as="h4" key={index} style={{ marginTop: "1em" }}>
          {line.replace(/\*\*/g, "")}
        </Header>
      );
    } else if (line.startsWith("```")) {
      // Code block (e.g., ``` equation ```)
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
      // Bullet point list item
      return <List.Item key={index}>{line.replace("* ", "")}</List.Item>;
    } else {
      // Regular paragraph
      return <p key={index}>{line}</p>;
    }
  });
};

function MathQuestion() {
  const [question, setQuestion] = useState(""); // User-inputted question
  const [response, setResponse] = useState(""); // API response
  const [error, setError] = useState(null); // Handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the question to the backend
      const result = await fetch(`${API_BASE_URL}/api/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!result.ok) {
        throw new Error(`Error: ${result.statusText}`);
      }

      const data = await result.json();
      setResponse(data.response || "No response received."); // Handle empty response
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to fetch the response. Please try again.");
      setResponse(""); // Clear previous response
    }
  };

  return (
    <Container style={{ marginTop: "2em" }}>
      <Segment raised style={{ padding: "2em" }}>
        {/* Header */}
        <Header as="h2" icon textAlign="center">
          <Icon name="question circle" />
          Let me help you with Maths!
        </Header>

        {/* Input Form */}
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

        {/* Error Message */}
        {error && (
          <Segment color="red" style={{ marginTop: "1em" }}>
            <Header as="h4" style={{ color: "red" }}>
              {error}
            </Header>
          </Segment>
        )}

        {/* API Response */}
        {response && (
          <Segment style={{ marginTop: "2em" }}>
            <Header as="h3">Response:</Header>
            <List>{formatResponse(response)}</List>
          </Segment>
        )}
      </Segment>
    </Container>
  );
}

export default MathQuestion;
