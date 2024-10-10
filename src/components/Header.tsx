import React, { useState, useEffect, useRef } from "react";

const Header = ({ title, onSearch, onNew, onFilter }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(""); // State to hold input for new list/folder
  const filterModalRef = useRef();
  const newModalRef = useRef();

  const handleFilterClick = () => {
    setIsFilterModalOpen(!isFilterModalOpen); // Toggle filter modal visibility
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true); // Open new list/folder modal
  };

  const handleCreate = () => {
    if (newTitle.trim()) {
      onNew(newTitle); // Pass new title back to parent component
      setNewTitle(""); // Reset input field
      setIsNewModalOpen(false); // Close modal after creation
    }
  };

  const closeModal = () => {
    setIsFilterModalOpen(false);
    setIsNewModalOpen(false);
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // Close filter modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(e.target)
      ) {
        setIsFilterModalOpen(false);
      }
      if (newModalRef.current && !newModalRef.current.contains(e.target)) {
        setIsNewModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-2 bg-white shadow-sm sticky top-0 z-[10] space-y-2">
      {/* First Row: Title and New button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={handleNewClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          New +
        </button>
      </div>

      {/* Second Row: Filter and Search */}
      <div className="flex justify-between items-center">
        <button onClick={handleFilterClick} className="p-2 border rounded">
          Filter
        </button>
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}`}
          className="ml-4 px-2 py-1 border rounded w-2/3"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter Modal for filter options */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={filterModalRef}
            className="bg-white p-4 rounded shadow-lg w-64"
          >
            <h2 className="text-lg font-bold mb-4">Filter by</h2>
            <button
              className="block w-full text-left p-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("recent")}
            >
              Recent
            </button>
            <button
              className="block w-full text-left p-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("title")}
            >
              Title
            </button>
            <button
              className="mt-4 w-full p-2 bg-red-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* New List/Folder Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={newModalRef}
            className="bg-white p-4 rounded shadow-lg w-80" // Added m-0 here
          >
            <h2 className="text-lg font-bold mb-4">
              Create a new {title.slice(0, -1).toLowerCase()}
            </h2>
            <input
              type="text"
              placeholder="Enter title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2 py-1 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
