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

// Function to fetch all folders sorted by order
const fetchSortedFolders = async (sortOrder) => {
  const response = await fetch(
    `http://localhost:8080/api/folders/sort/${sortOrder}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const FoldersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // State to manage sorting order

  // Use React Query to fetch folders based on search query
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders", searchQuery], // queryKey includes only searchQuery
    queryFn: () => fetchFolders(searchQuery), // Pass the search query to the fetch function
  });

  // Use React Query to fetch sorted folders when sortOrder changes
  const {
    data: sortedFolders,
    isLoading: isLoadingSorted,
    error: sortedError,
  } = useQuery({
    queryKey: ["sortedFolders", sortOrder], // queryKey includes sortOrder
    queryFn: () => fetchSortedFolders(sortOrder),
    enabled: !!sortOrder, // Only fetch when sortOrder is set
  });

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query); // Update searchQuery state, triggering a new fetch
    setSortOrder(""); // Reset sortOrder when searching
  };

  // Handle sorting based on selected option
  const handleFilter = (option) => {
    if (option === "titleAtoZ") {
      setSortOrder("asc"); // Set sort order to ascending
    } else if (option === "titleZtoA") {
      setSortOrder("desc"); // Set sort order to descending
    }
    setSearchQuery(""); // Reset search query when sorting
  };

  const handleNew = () => {
    console.log("Create new folder");
  };

  // Choose which folder data to display based on whether sorting is applied
  const displayFolders = sortOrder ? sortedFolders : folders;

  return (
    <div className="flex-grow">
      <Header
        title="Folders"
        onSearch={handleSearch} // Search handler will update searchQuery
        onNew={handleNew}
        onFilter={handleFilter} // Pass the filter handler
      />
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {isLoading || isLoadingSorted ? (
          <p>Loading folders...</p>
        ) : error || sortedError ? (
          <p>Error loading folders: {error?.message || sortedError?.message}</p>
        ) : displayFolders.length > 0 ? (
          displayFolders.map((folder, index) => (
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
