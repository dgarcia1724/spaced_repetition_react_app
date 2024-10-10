import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import TopNav from "./components/TopNav";

// pages
import HomePage from "./pages/Home";
import FoldersPage from "./pages/FoldersPage";
import ProblemsPage from "./pages/ProblemsPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems/:list" element={<ProblemsPage />} />
          <Route path="/folders" element={<FoldersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
