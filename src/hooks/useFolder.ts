import { useQuery } from "@tanstack/react-query";
import { fetchFolders, fetchSortedFolders } from "../services/api";

export const useFolders = (searchQuery: string) => {
  return useQuery({
    queryKey: ["folders", searchQuery],
    queryFn: () => fetchFolders(searchQuery),
  });
};

export const useSortedFolders = (sortOrder: string) => {
  return useQuery({
    queryKey: ["sortedFolders", sortOrder],
    queryFn: () => fetchSortedFolders(sortOrder),
    enabled: !!sortOrder,
  });
};
