import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ItemActions from "../components/ItemActions";
import Modal from "../components/Modal"; // Make sure you have this component

// Function to create a new folder via POST request
const createFolder = async (newFolderName) => {
  const response = await fetch("http://localhost:8080/api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newFolderName }), // Send the folder name in the request body
  });

  if (!response.ok) {
    throw new Error("Failed to create folder");
  }

  return response.json();
};

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

// Add this function to update a folder
const updateFolder = async ({ id, newName }) => {
  const response = await fetch(`http://localhost:8080/api/folders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!response.ok) {
    throw new Error("Failed to update folder");
  }

  return response.json();
};

const FoldersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders", searchQuery],
    queryFn: () => fetchFolders(searchQuery),
  });

  const {
    data: sortedFolders,
    isLoading: isLoadingSorted,
    error: sortedError,
  } = useQuery({
    queryKey: ["sortedFolders", sortOrder],
    queryFn: () => fetchSortedFolders(sortOrder),
    enabled: !!sortOrder,
  });

  const folderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries("folders");
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:8080/api/folders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["sortedFolders"]);
    },
  });

  // Add this mutation for updating folders
  const updateFolderMutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["sortedFolders"]);
      setEditingFolder(null);
      setIsEditModalOpen(false);
    },
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSortOrder("");
  };

  const handleFilter = (option) => {
    if (option === "titleAtoZ") {
      setSortOrder("asc");
    } else if (option === "titleZtoA") {
      setSortOrder("desc");
    }
    setSearchQuery("");
  };

  const handleNewFolder = (newTitle) => {
    folderMutation.mutate(newTitle);
  };

  const handleDeleteFolder = (folder) => {
    setFolderToDelete(folder);
    setIsDeleteModalOpen(true);
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingFolder) {
      updateFolderMutation.mutate({
        id: editingFolder.id,
        newName: editingFolder.name,
      });
    }
  };

  const displayFolders = sortOrder ? sortedFolders : folders;

  const handleFolderClick = (folderId) => {
    navigate(`/folders/${folderId}/lists`);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFolder(null);
  };

  const confirmDeleteFolder = () => {
    if (folderToDelete) {
      deleteFolderMutation.mutate(folderToDelete.id);
      setIsDeleteModalOpen(false);
      setFolderToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  return (
    <div className="flex-grow">
      <Header
        title="Folders"
        onSearch={handleSearch}
        onNew={handleNewFolder}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isLoading || isLoadingSorted ? (
          <p>Loading folders...</p>
        ) : error || sortedError ? (
          <p>Error loading folders: {error?.message || sortedError?.message}</p>
        ) : displayFolders.length > 0 ? (
          displayFolders.map((folder) => (
            <div
              key={folder.id}
              className="bg-gray-100 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <span
                className="cursor-pointer flex-grow truncate mr-2"
                onClick={() => handleFolderClick(folder.id)}
              >
                {folder.name}
              </span>
              <ItemActions
                onDelete={() => handleDeleteFolder(folder)}
                onEdit={() => handleEditFolder(folder)}
                itemName={folder.name}
              />
            </div>
          ))
        ) : (
          <p>No matching folders</p>
        )}
      </div>

      {/* Edit Folder Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Folder"
        closeOnEsc={true}
        closeOnOutsideClick={true}
      >
        <input
          type="text"
          value={editingFolder?.name || ""}
          onChange={(e) =>
            setEditingFolder({ ...editingFolder, name: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Delete Folder Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Folder"
        closeOnEsc={true}
        closeOnOutsideClick={true}
      >
        <p className="mb-4">
          Are you sure you want to delete the folder "{folderToDelete?.name}"?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeDeleteModal}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteFolder}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FoldersPage;
