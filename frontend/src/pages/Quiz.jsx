import React, { useState, useEffect } from "react";
import axios from "axios";

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    // Fetch quiz data from the backend
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/dataapi/quizzes/"
        );
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching quiz data");
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAnswerChange = (quizId, questionId, choiceId) => {
    // Set selected answers for each question
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [quizId]: {
        ...prevAnswers[quizId],
        [questionId]: choiceId,
      },
    }));
  };

  const handleSubmit = (quizId) => {
    console.log(
      `Submitted answers for Quiz ${quizId}:`,
      selectedAnswers[quizId]
    );
    // Here you can handle form submission logic (e.g., sending the answers to the backend)
  };

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Available Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>

            <h3>Questions:</h3>
            <ul>
              {quiz.questions && quiz.questions.length > 0 ? (
                quiz.questions.map((question) => (
                  <li key={question.id}>
                    <strong>{question.question_text}</strong>
                    <ul>
                      {question.choices.map((choice) => (
                        <li key={choice.id}>
                          <label>
                            <input
                              type="radio"
                              name={`question-${quiz.id}-${question.id}`} // Unique name for each question
                              value={choice.id}
                              checked={
                                selectedAnswers[quiz.id]?.[question.id] ===
                                choice.id
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  quiz.id,
                                  question.id,
                                  choice.id
                                )
                              }
                            />
                            {choice.choice_text}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <p>No questions available for this quiz.</p>
              )}
            </ul>

            <button onClick={() => handleSubmit(quiz.id)}>Submit Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quiz;
