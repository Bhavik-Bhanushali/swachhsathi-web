import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';
import { useEffect, useState } from 'react';

// Keys for React Query
const AUTH_KEYS = {
    user: ['auth', 'user'],
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const [isInitialized, setIsInitialized] = useState(false);

    // Query to get the current user
    const {
        data: user,
        isLoading: isQueryLoading,
        error,
        isFetched,
    } = useQuery({
        queryKey: AUTH_KEYS.user,
        queryFn: async () => {
            const currentUser = await AuthService.getCurrentUser();
            setIsInitialized(true);
            return currentUser;
        },
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
    });

    // Combined loading state - true until we've fetched and initialized
    const isLoading = isQueryLoading || !isInitialized;

    // Subscribe to auth state changes (skip initial call since getCurrentUser handles it)
    useEffect(() => {
        let isFirstCall = true;
        const unsubscribe = AuthService.onAuthChange(async (firebaseUser) => {
            // Skip the first call as getCurrentUser already handles initialization
            if (isFirstCall) {
                isFirstCall = false;
                return;
            }
            
            if (firebaseUser) {
                // Fetch full user data from Firestore
                try {
                    const { UserService } = await import('../services/UserService');
                    const userDoc = await UserService.default.getUser(firebaseUser.uid);
                    queryClient.setQueryData(AUTH_KEYS.user, userDoc || firebaseUser);
                } catch {
                    queryClient.setQueryData(AUTH_KEYS.user, firebaseUser);
                }
            } else {
                queryClient.setQueryData(AUTH_KEYS.user, null);
            }
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
