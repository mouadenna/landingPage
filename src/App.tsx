import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import PasswordGame from "./components/PasswordGame";
import {JoinUs} from './components/Joinus';
import "./App.css";
import MainPage from "./mainpage";
import {SubmissionsDashboard} from "./components/SubmissionsDashboard";

function App() {
  useEffect(() => {
    document.title = "Code-ESI";
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="md:hidden">
        <div className="mb-20"></div>
      </div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/password-game" element={<PasswordGame />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/Submissions-Dashboard" element={<SubmissionsDashboard />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <Analytics />
    </Router>
  );
}

export default App;