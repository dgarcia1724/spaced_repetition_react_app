import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

// Function to fetch folders from the API with optional search query
const fetchFolders = async (searchQuery = "") => {
  const response = await fetch(
    `http://localhost:8080/api/folders/search?prefix=${searchQuery}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const FoldersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch folders based on search query
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders", searchQuery], // queryKey includes the search query
    queryFn: () => fetchFolders(searchQuery), // Pass the search query to the fetch function
  });

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query); // Update searchQuery state, triggering a new fetch
  };

  const handleNew = () => {
    console.log("Create new folder");
  };

  const handleFilter = () => {
    console.log("Filter folders by: recent or title");
  };

  return (
    <div className="flex-grow">
      <Header
        title="Folders"
        onSearch={handleSearch} // Search handler will update searchQuery
        onNew={handleNew}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading folders...</p>
        ) : error ? (
          <p>Error loading folders: {error.message}</p>
        ) : folders.length > 0 ? (
          folders.map((folder, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 shadow">
              {folder.name}
            </div>
          ))
        ) : (
          <p>No matching folders</p>
        )}
      </div>
    </div>
  );
};

export default FoldersPage;
