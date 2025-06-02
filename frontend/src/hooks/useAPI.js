import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../utils/api';

// Blog generation
export const useGenerateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.generateBlog,
    onSuccess: () => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

// History management
export const useHistory = (params = {}) => {
  return useQuery({
    queryKey: ['history', params],
    queryFn: () => api.getHistory(params),
  });
};

export const useGeneration = (id) => {
  return useQuery({
    queryKey: ['generation', id],
    queryFn: () => api.getGeneration(id),
    enabled: !!id,
  });
};

export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

// Models and status
export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: api.getModels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStatus = () => {
  return useQuery({
    queryKey: ['status'],
    queryFn: api.getStatus,
    refetchInterval: 30000, // Check every 30 seconds
  });
}; 