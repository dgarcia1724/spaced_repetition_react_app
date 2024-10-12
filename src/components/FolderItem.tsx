import React from "react";
import { Folder } from "../types";
import { useFolderMutations } from "../hooks/useFolderMutations";

interface FolderItemProps {
  folder: Folder;
  onEdit: (folder: Folder) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onEdit }) => {
  const { deleteFolderMutation } = useFolderMutations();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      deleteFolderMutation.mutate(folder.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <span>{folder.name}</span>
      <div>
        <button
          onClick={() => onEdit(folder)}
          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FolderItem;
