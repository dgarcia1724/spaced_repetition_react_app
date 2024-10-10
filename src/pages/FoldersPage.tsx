// components/FoldersPage.js
import React from "react";
import Header from "../components/Header";

const FoldersPage = () => {
  const folders = [
    "Math Folder",
    "Science Folder",
    "History Folder",
    "English Folder",
  ];

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
        {folders.map((folder, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 shadow">
            {folder}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoldersPage;
