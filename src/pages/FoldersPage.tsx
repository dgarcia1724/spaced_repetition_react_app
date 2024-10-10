import React from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

// Function to fetch folders from the API
const fetchFolders = async () => {
  const response = await fetch("http://localhost:8080/api/folders");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const FoldersPage = () => {
  // Use React Query to fetch folders
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  const handleSearch = (query) => {
    console.log(`Search for folder: ${query}`);
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
        onSearch={handleSearch}
        onNew={handleNew}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading folders...</p>
        ) : error ? (
          <p>Error loading folders: {error.message}</p>
        ) : (
          folders.map((folder, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 shadow">
              {folder.name}{" "}
              {/* Assuming the API returns an object with a 'name' property */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoldersPage;
