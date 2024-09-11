import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
