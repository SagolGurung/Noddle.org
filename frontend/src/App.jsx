import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Exams from "./pages/Exams";
import Courses from "./pages/Courses";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />

        {/* Define the Register route */}
        <Route path="/register" element={<Register />} />

        {/* Define the Login route */}
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
