import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Header, Segment, List, Button } from "semantic-ui-react";

function Quizwebcam() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exitCount, setExitCount] = useState(0);
  const [f11Count, setF11Count] = useState(0);
  const [rightClickCount, setRightClickCount] = useState(0);
  const [showHaltPage, setShowHaltPage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "";

  // States and refs for camera integration
  const [statusMessage, setStatusMessage] = useState("Waiting for camera...");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // New state variable to track suspicious counts
  const [suspiciousCount, setSuspiciousCount] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dataapi/quizzes/1`);
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Error fetching quiz data");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [API_BASE_URL]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen) {
        alert("You have exited fullscreen mode. Please stay in fullscreen during the exam.");
        setExitCount((prev) => prev + 1);
      }
    };

    const handleKeyDown = (event) => {
      if (["Escape", "F5", "Tab", "Alt"].includes(event.key)) {
        if (exitCount + 1 >= 10) {
          setShowHaltPage(true);
          return;
        }
      }
      if (event.key === "F11") {
        setF11Count((prev) => prev + 1);
      }
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      setRightClickCount((prev) => prev + 1);
    };

    if (quizStarted) {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("contextmenu", handleRightClick);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, [exitCount, quizStarted]);

  useEffect(() => {
    if (exitCount >= 3 || f11Count >= 3 || rightClickCount >= 3) {
      setShowHaltPage(true);
    }
  }, [exitCount, f11Count, rightClickCount]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen(); // Firefox
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(); // Chrome, Safari, Opera
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen(); // IE/Edge
    }
  };

  // This effect starts the camera and sets up periodic frame capture
  useEffect(() => {
    if (!quizStarted) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStatusMessage("Camera access granted. Monitoring...");
        }

        // Capture a frame every 5 seconds (polling)
        const intervalId = setInterval(() => {
          captureFrame();
        }, 5000);

        return () => clearInterval(intervalId);
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setStatusMessage("Unable to access camera.");
      });
  }, [quizStarted]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");

    axios
      .post(`${API_BASE_URL}/api/webcam/`, { image: dataURL })
      .then((res) => {
        const { status } = res.data;
        if (status === "normal") {
          setStatusMessage("Face Detected (Normal)");
          setSuspiciousCount(0); // Reset suspicious count
        } else if (status === "phone_detected") {
          setStatusMessage("Cell Phone Detected (Suspicious)");
          // setShowHaltPage(true); // Halt the exam immediately
        } else if (status === "suspicious") {
          setStatusMessage("No Face Detected (Suspicious)");

          // Increment suspicious count and check threshold
          setSuspiciousCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= 3) {
              setShowHaltPage(true); // Halt exam after 3 consecutive suspicious detections
            }
            return newCount;
          });
        }
      })
      .catch((err) => console.error("Error sending frame to backend:", err));
  };

  if (loading) return <p>Loading quiz details...</p>;
  if (error) return <p>{error}</p>;

  if (showHaltPage) {
    return (
      <Container textAlign="center" style={{ marginTop: "5em" }}>
        <Segment padded="very" style={{ border: "2px solid red", background: "#f8d7da" }}>
          <Header as="h2" style={{ color: "red" }}>Exam Halted</Header>
          <p>Suspicious activity detected. Your exam has been paused.</p>
        </Segment>
      </Container>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Container>
      {!quizStarted ? (
        <Button onClick={handleStartQuiz} primary>
          Start Quiz
        </Button>
      ) : (
        <Segment vertical style={{ padding: "4em 0em" }}>
          <Header as="h2">{quiz.title}</Header>
          <Header as="h4" style={{ textAlign: "right" }}>
            Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Header>
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
          <div style={{ marginTop: "20px" }}>
            <p>Status: {statusMessage}</p>
            <video ref={videoRef} style={{ width: "300px" }} />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        </Segment>
      )}
    </Container>
  );
}

export default Quizwebcam;
