import React, { useState } from "react";
import { useParams } from "react-router-dom"; // To get the folder ID from the URL
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

// Function to fetch lists by folder ID with optional search query
const fetchLists = async (folderId, searchQuery = "") => {
  const response = await fetch(
    `http://localhost:8080/api/lists/folder/${folderId}/search?prefix=${searchQuery}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch lists");
  }
  return response.json();
};

// Update fetchSortedLists to handle 'asc' and 'desc' sorting
const fetchSortedLists = async (folderId, sortOrder) => {
  const response = await fetch(
    `http://localhost:8080/api/lists/folder/${folderId}/sort/${sortOrder}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch sorted lists");
  }
  return response.json();
};

const ListsPage = () => {
  const { folderId } = useParams(); // Get the folder ID from URL params
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Use React Query to fetch lists based on search query or sort order
  const {
    data: lists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lists", folderId, searchQuery, sortOrder],
    queryFn: () =>
      searchQuery
        ? fetchLists(folderId, searchQuery)
        : fetchSortedLists(folderId, sortOrder),
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (option) => {
    if (option === "titleAtoZ") {
      setSortOrder("asc");
    } else if (option === "titleZtoA") {
      setSortOrder("desc");
    }
    setSearchQuery("");
  };

  // You might want to implement this function if you need it
  const handleNewList = () => {
    // Implementation for creating a new list
  };

  return (
    <div className="flex-grow">
      <Header
        title="Lists"
        onSearch={handleSearch}
        onNew={handleNewList}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading lists...</p>
        ) : error ? (
          <p>Error loading lists: {error.message}</p>
        ) : lists && lists.length > 0 ? (
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
