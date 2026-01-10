import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/UserService';

const USER_KEYS = {
    profile: (uid) => ['user', 'profile', uid],
    workers: ['user', 'workers'],
};

export const useUser = () => {
    const queryClient = useQueryClient();

    // Hook to fetch user profile
    const useGetUser = (uid) => {
        return useQuery({
            queryKey: USER_KEYS.profile(uid || ''),
            queryFn: () => UserService.getUser(uid),
            enabled: !!uid, // Only run if uid is provided
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    };

    // Hook to fetch all workers
    const useGetWorkers = () => {
        return useQuery({
            queryKey: USER_KEYS.workers,
            queryFn: () => UserService.getWorkers(),
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    };

    // Mutation to create a new user
    const createUserMutation = useMutation({
        mutationFn: ({ uid, ...data }) => UserService.createUser(uid, data),
        onSuccess: (_, variables) => {
            // Update cache for this user
            queryClient.setQueryData(
                USER_KEYS.profile(variables.uid),
                variables
            );
            // Invalidate workers list if the new user is a worker
            if (variables.role === 'worker') {
                queryClient.invalidateQueries({
                    queryKey: USER_KEYS.workers,
                });
            }
        },
    });

    // Mutation to update an existing user
    const updateUserMutation = useMutation({
        mutationFn: ({ uid, data }) =>
            UserService.updateUser(uid, data),
        onSuccess: (_, variables) => {
            // Trigger refetch for updated user
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.profile(variables.uid),
            });
            // Invalidate workers list indiscriminately or check logic
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.workers,
            });
        },
    });

    return {
        useGetUser,
        useGetWorkers,

        createUser: createUserMutation.mutateAsync,
        isCreatingUser: createUserMutation.isPending,
        createError: createUserMutation.error,

        updateUser: updateUserMutation.mutateAsync,
        isUpdatingUser: updateUserMutation.isPending,
        updateError: updateUserMutation.error,
    };
};
