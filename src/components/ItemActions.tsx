import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  itemName: string;
}

const ItemActions: React.FC<ItemActionsProps> = ({
  onEdit,
  onDelete,
  itemName,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="text-blue-500 hover:text-blue-700"
        aria-label={`Edit ${itemName}`}
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        aria-label={`Delete ${itemName}`}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default ItemActions;
