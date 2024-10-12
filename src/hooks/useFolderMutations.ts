import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder, updateFolder, deleteFolder } from "../services/api";

export const useFolderMutations = () => {
  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["sortedFolders"]);
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["sortedFolders"]);
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["sortedFolders"]);
    },
  });

  return {
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
};
