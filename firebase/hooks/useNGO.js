// Hook utilities for interacting with NGOService using React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NGOService from '../services/NGOService';

// Query keys for caching
const NGO_KEYS = {
    all: ['ngos'],
    byId: (ngoId) => ['ngo', ngoId],
    byStatus: (status) => ['ngos', 'status', status],
};

/**
 * Hook to create a new NGO.
 * Returns mutateAsync function, loading state and error.
 */
export const useCreateNGO = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ ngoId, ngoData }) => NGOService.createNGO(ngoId, ngoData),
        onSuccess: () => {
            // Invalidate the list of NGOs so the UI reflects the new entry
            queryClient.invalidateQueries({ queryKey: NGO_KEYS.all });
        },
    });
    return {
        createNGO: mutation.mutateAsync,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};

/**
 * Hook to fetch a single NGO by its ID.
 * Returns data, isLoading, error, and refetch function.
 */
export const useNGO = (ngoId) => {
    const query = useQuery({
        queryKey: NGO_KEYS.byId(ngoId),
        queryFn: () => NGOService.getNGO(ngoId),
        enabled: !!ngoId,
    });
    
    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};

/**
 * Hook to fetch all NGOs.
 */
export const useNGOs = () => {
    return useQuery({
        queryKey: NGO_KEYS.all,
        queryFn: () => NGOService.getAllNGOs(),
    });
};

/**
 * Hook to fetch NGOs filtered by status (e.g., 'pending', 'approved', 'rejected').
 */
export const useNGOsByStatus = (status) => {
    return useQuery({
        queryKey: NGO_KEYS.byStatus(status),
        queryFn: () => NGOService.getNGOsByStatus(status),
        enabled: !!status,
    });
};

/**
 * Hook to update the status of an NGO (admin approval/rejection).
 */
export const useUpdateNGOStatus = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ ngoId, status }) => NGOService.updateNGOStatus(ngoId, status),
        onSuccess: (_, variables) => {
            // Invalidate both the specific NGO and any list queries that might be affected
            queryClient.invalidateQueries({ queryKey: NGO_KEYS.byId(variables.ngoId) });
            queryClient.invalidateQueries({ queryKey: NGO_KEYS.all });
        },
    });
    return {
        updateNGOStatus: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};

/**
 * Hook to update NGO details (excluding status).
 */
export const useUpdateNGO = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ ngoId, ngoData }) => NGOService.updateNGO(ngoId, ngoData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: NGO_KEYS.byId(variables.ngoId) });
            queryClient.invalidateQueries({ queryKey: NGO_KEYS.all });
        },
    });
    return {
        updateNGO: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};

// Export a consolidated object for convenience (optional)
export const useNGOService = () => ({
    useCreateNGO,
    useNGO,
    useNGOs,
    useNGOsByStatus,
    useUpdateNGOStatus,
    useUpdateNGO,
});
