import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

// Update the Problem interface to match the new data structure
interface Problem {
  id: number;
  name: string;
  confidence: number;
  link: string;
}

// Update the fetch function to match the new data structure
const fetchProblems = async (listId: string): Promise<Problem[]> => {
  const response = await fetch(
    `http://localhost:8080/api/problems/list/${listId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch problems");
  }
  return response.json();
};

// Update the create problem function
const createProblem = async ({
  listId,
  name,
  link,
  confidence,
}: {
  listId: string;
  name: string;
  link: string;
  confidence: number;
}): Promise<Problem> => {
  const response = await fetch(
    `http://localhost:8080/api/problems/list/${listId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link, confidence }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create problem");
  }
  return response.json();
};

// Add an update problem function
const updateProblem = async (problem: Problem): Promise<Problem> => {
  const response = await fetch(
    `http://localhost:8080/api/problems/${problem.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(problem),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update problem");
  }
  return response.json();
};

// Add a delete problem function
const deleteProblem = async (problemId: number): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/api/problems/${problemId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete problem");
  }
};

// Helper function to get confidence color
const getConfidenceColor = (confidence: number): string => {
  const colors = [
    "bg-red-500",
    "bg-red-400",
    "bg-red-300",
    "bg-orange-500",
    "bg-orange-400",
    "bg-orange-300",
    "bg-yellow-500",
    "bg-yellow-400",
    "bg-yellow-300",
    "bg-green-400",
    "bg-green-500",
  ];
  return colors[Math.min(Math.max(Math.floor(confidence), 0), 10)];
};

// Problem item component
const ProblemItem: React.FC<{
  problem: Problem;
  onEdit: (problem: Problem) => void;
  onDelete: (problemId: number) => void;
}> = ({ problem, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div
          className={`w-4 h-4 rounded-full ${getConfidenceColor(
            problem.confidence
          )}`}
        ></div>
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {problem.name}
        </a>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(problem)}
          className="text-blue-500 hover:text-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(problem.id)}
          className="text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProblemsPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const location = useLocation();
  const listName = location.state?.listName || "Unknown List";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [problemName, setProblemName] = useState("");
  const [problemLink, setProblemLink] = useState("");
  const [problemConfidence, setProblemConfidence] = useState(10);
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState<number | null>(
    null
  );

  const {
    data: problems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["problems", listId],
    queryFn: () => fetchProblems(listId),
  });

  const problemMutation = useMutation({
    mutationFn: (problem: Problem) =>
      problem.id
        ? updateProblem(problem)
        : createProblem({ listId, ...problem }),
    onSuccess: () => {
      queryClient.invalidateQueries(["problems", listId]);
      toast.success(
        editingProblem
          ? "Problem updated successfully!"
          : "Problem created successfully!"
      );
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to ${editingProblem ? "update" : "create"} problem: ${
          error.message
        }`
      );
    },
  });

  const deleteProblemMutation = useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      queryClient.invalidateQueries(["problems", listId]);
      toast.success("Problem deleted successfully!");
      setIsDeleteModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete problem: ${error.message}`);
    },
  });

  const handleOpenModal = (problem?: Problem) => {
    if (problem) {
      setEditingProblem(problem);
      setProblemName(problem.name);
      setProblemLink(problem.link);
      setProblemConfidence(problem.confidence);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProblem(null);
    setProblemName("");
    setProblemLink("");
    setProblemConfidence(10);
  };

  const handleSubmit = () => {
    if (problemName.trim()) {
      const problem: Partial<Problem> = {
        name: problemName.trim(),
        link: problemLink.trim(),
        confidence: problemConfidence,
      };
      if (editingProblem) {
        problem.id = editingProblem.id;
      }
      problemMutation.mutate(problem as Problem);
    }
  };

  const handleDeleteProblem = (problemId: number) => {
    setDeletingProblemId(problemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProblem = () => {
    if (deletingProblemId) {
      deleteProblemMutation.mutate(deletingProblemId);
    }
  };

  return (
    <div className="flex-grow">
      {/* Replace the Header component with a simple title */}
      <h1 className="text-2xl font-bold p-4 bg-gray-100">
        Problems for {listName}
      </h1>
      <div className="p-4">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          + New Problem
        </button>
        {isLoading ? (
          <p>Loading problems...</p>
        ) : error ? (
          <p>Error loading problems: {(error as Error).message}</p>
        ) : problems && problems.length > 0 ? (
          <div className="space-y-4">
            {problems.map((problem) => (
              <ProblemItem
                key={problem.id}
                problem={problem}
                onEdit={handleOpenModal}
                onDelete={handleDeleteProblem}
              />
            ))}
          </div>
        ) : (
          <p>No problems found</p>
        )}
      </div>

      {/* Problem Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProblem ? "Edit Problem" : "New Problem"}
        closeOnEsc={true}
        closeOnOutsideClick={true}
      >
        <input
          type="text"
          value={problemName}
          onChange={(e) => setProblemName(e.target.value)}
          placeholder="Enter problem name"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          value={problemLink}
          onChange={(e) => setProblemLink(e.target.value)}
          placeholder="Enter problem link"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="mb-4">
          <label className="block mb-2">Confidence (0-10):</label>
          <input
            type="range"
            min="0"
            max="10"
            value={problemConfidence}
            onChange={(e) => setProblemConfidence(parseInt(e.target.value))}
            className="w-full"
          />
          <span>{problemConfidence}</span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingProblem ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        closeOnEsc={true}
        closeOnOutsideClick={true}
      >
        <p>Are you sure you want to delete this problem?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteProblem}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProblemsPage;
