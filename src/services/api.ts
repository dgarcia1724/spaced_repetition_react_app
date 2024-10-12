const API_BASE_URL = "http://localhost:8080/api";

export const fetchFolders = async (searchQuery = "") => {
  const response = await fetch(
    `${API_BASE_URL}/folders/search?prefix=${searchQuery}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchSortedFolders = async (sortOrder: string) => {
  const response = await fetch(`${API_BASE_URL}/folders/sort/${sortOrder}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const createFolder = async (newFolderName: string) => {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newFolderName }),
  });

  if (!response.ok) {
    throw new Error("Failed to create folder");
  }

  return response.json();
};

export const updateFolder = async ({
  id,
  newName,
}: {
  id: string;
  newName: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
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

export const deleteFolder = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }
};
