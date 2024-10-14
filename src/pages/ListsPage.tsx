import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Header from "../components/Header";
import ItemActions from "../components/ItemActions";
import Modal from "../components/Modal";

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

// Function to fetch sorted lists
const fetchSortedLists = async (folderId, sortOrder) => {
  const response = await fetch(
    `http://localhost:8080/api/lists/folder/${folderId}/sort/${sortOrder}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch sorted lists");
  }
  return response.json();
};

// Function to create a new list
const createList = async ({ folderId, name }) => {
  const response = await fetch(
    `http://localhost:8080/api/lists/folder/${folderId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create list");
  }
  return response.json();
};

// Add this new function to fetch folder details
const fetchFolderDetails = async (folderId) => {
  const response = await fetch(`http://localhost:8080/api/folders/${folderId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch folder details");
  }
  return response.json();
};

// Add this function to update a list
const updateList = async ({ id, newName }) => {
  const response = await fetch(`http://localhost:8080/api/lists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!response.ok) {
    throw new Error("Failed to update list");
  }

  return response.json();
};

const ListsPage = () => {
  const { folderId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const queryClient = useQueryClient();
  const [editingList, setEditingList] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: lists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lists", folderId, searchQuery],
    queryFn: () => fetchLists(folderId, searchQuery),
  });

  const {
    data: sortedLists,
    isLoading: isLoadingSorted,
    error: sortedError,
  } = useQuery({
    queryKey: ["sortedLists", folderId, sortOrder],
    queryFn: () => fetchSortedLists(folderId, sortOrder),
    enabled: !!sortOrder,
  });

  const createListMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", folderId]);
      queryClient.invalidateQueries(["sortedLists", folderId]);
      toast.success("List created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create list: " + error.message);
    },
  });

  const updateListMutation = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", folderId]);
      queryClient.invalidateQueries(["sortedLists", folderId]);
      setEditingList(null);
      setIsEditModalOpen(false);
      toast.success("List updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update list: ${error.message}`);
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

  const handleNewList = (newTitle) => {
    createListMutation.mutate({ folderId, name: newTitle });
  };

  // Add this new query to fetch folder details
  const {
    data: folderDetails,
    isLoading: isFolderLoading,
    error: folderError,
  } = useQuery({
    queryKey: ["folderDetails", folderId],
    queryFn: () => fetchFolderDetails(folderId),
  });

  const displayLists = sortOrder ? sortedLists : lists;

  const handleEditList = (list) => {
    setEditingList(list);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingList) {
      updateListMutation.mutate({
        id: editingList.id,
        newName: editingList.name,
      });
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingList(null);
  };

  return (
    <div className="flex-grow">
      <Header
        title={folderDetails ? `Lists for ${folderDetails.name}` : "Lists"}
        onSearch={handleSearch}
        onNew={handleNewList}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isLoading || isLoadingSorted ? (
          <p>Loading lists...</p>
        ) : error || sortedError ? (
          <p>Error loading lists: {error?.message || sortedError?.message}</p>
        ) : displayLists && displayLists.length > 0 ? (
          displayLists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-100 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <span className="truncate">{list.name}</span>
              <ItemActions
                onEdit={() => handleEditList(list)}
                itemName={list.name}
              />
            </div>
          ))
        ) : (
          <p>No lists found</p>
        )}
      </div>

      {/* Edit List Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit List"
        closeOnEsc={true}
        closeOnOutsideClick={true}
      >
        <input
          type="text"
          value={editingList?.name || ""}
          onChange={(e) =>
            setEditingList({ ...editingList, name: e.target.value })
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
    </div>
  );
};

export default ListsPage;
