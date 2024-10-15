import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import TopNav from "./components/TopNav";

// pages
import HomePage from "./pages/Home";
import FoldersPage from "./pages/FoldersPage";
import ListsPage from "./pages/ListsPage";
import ProblemsPage from "./pages/ProblemsPage";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <TopNav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/folders" element={<FoldersPage />} />
            <Route path="/folders/:folderId/lists" element={<ListsPage />} />
            <Route path="/lists/:listId/problems" element={<ProblemsPage />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
