import React, { useState } from "react";
import { useParams } from "react-router-dom"; // To get the folder ID from the URL
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

// Function to fetch lists by folder ID
const fetchLists = async (folderId) => {
  const response = await fetch(
    `http://localhost:8080/api/lists/folder/${folderId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch lists");
  }
  return response.json();
};

const ListsPage = () => {
  const { folderId } = useParams(); // Get the folder ID from URL params
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch lists based on folder ID
  const {
    data: lists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lists", folderId, searchQuery],
    queryFn: () => fetchLists(folderId),
  });

  return (
    <div className="flex-grow">
      <Header
        title="Lists"
        onSearch={(query) => setSearchQuery(query)}
        // You can add other actions as needed
      />
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading lists...</p>
        ) : error ? (
          <p>Error loading lists: {error.message}</p>
        ) : lists.length > 0 ? (
          lists.map((list, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 shadow">
              {list.name}
            </div>
          ))
        ) : (
          <p>No lists found</p>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
