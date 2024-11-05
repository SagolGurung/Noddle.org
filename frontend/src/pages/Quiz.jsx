import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Header, Segment, List, Button } from "semantic-ui-react";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch quiz data for a specific course
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/dataapi/quizzes/1"
        );
        setQuiz(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Error fetching quiz data");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  if (loading) {
    return <p>Loading quiz details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container>
      <Segment vertical style={{ padding: "4em 0em" }}>
        <Header as="h2">{quiz.title}</Header>

        <Header as="h3">Questions:</Header>
        <List divided relaxed>
          {quiz.questions.map((question) => (
            <List.Item key={question.id}>
              <List.Content>
                <List.Header>{question.question_text}</List.Header>
                <List.Description>
                  {question.choices.map((choice) => (
                    <div key={choice.id}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={choice.id}
                        />
                        {choice.choice_text}
                      </label>
                    </div>
                  ))}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
        <Button primary>Submit Quiz</Button>
      </Segment>
    </Container>
  );
}

export default Quiz;
