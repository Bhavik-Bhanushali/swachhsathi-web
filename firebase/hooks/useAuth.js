import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';
import { useEffect } from 'react';

// Keys for React Query
const AUTH_KEYS = {
    user: ['auth', 'user'],
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Query to get the current user
    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: AUTH_KEYS.user,
        queryFn: () => {
            return AuthService.getCurrentUser();
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });

    // Subscribe to auth state changes
    useEffect(() => {
        const unsubscribe = AuthService.onAuthChange((user) => {
            queryClient.setQueryData(AUTH_KEYS.user, user);
        });

        return () => unsubscribe();
    }, [queryClient]);

    // Sign In mutation
    const signInMutation = useMutation({
        mutationFn: ({ email, password }) =>
            AuthService.signIn(email, password),
        onSuccess: (user) => {
            queryClient.setQueryData(AUTH_KEYS.user, user);
        },
    });

    // Sign Up mutation
    const signUpMutation = useMutation({
        mutationFn: ({ email, password }) =>
            AuthService.signUp(email, password),
        onSuccess: (user) => {
            queryClient.setQueryData(AUTH_KEYS.user, user);
        },
    });

    // Sign Out mutation
    const signOutMutation = useMutation({
        mutationFn: () => AuthService.logout(),
        onSuccess: () => {
            queryClient.setQueryData(AUTH_KEYS.user, null);
            // queryClient.clear();
        },
    });

    return {
        user,
        isLoading,
        error,

        signIn: signInMutation.mutateAsync,
        isSigningIn: signInMutation.isPending,
        signInError: signInMutation.error || null,

        signUp: signUpMutation.mutateAsync,
        isSigningUp: signUpMutation.isPending,
        signUpError: signUpMutation.error || null,

        signOut: signOutMutation.mutateAsync,
        isSigningOut: signOutMutation.isPending,
    };
};
