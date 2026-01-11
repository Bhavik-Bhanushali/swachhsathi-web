import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config";
import UserService from "./UserService";

export const AuthService = {
    // Sign in with email and password
    signIn: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Fetch user document from Firestore to get additional fields like 'type'
            const userDoc = await UserService.getUser(userCredential.user.uid);
            return userDoc || userCredential.user;
        } catch (error) {
            const authError = error;
            console.error("Error signing in:", authError.message);
            throw authError; // Re-throw to be handled by the caller
        }
    },

    // Sign up with email and password
    signUp: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            const authError = error;
            console.error("Error signing up:", authError.message);
            throw authError;
        }
    },

    // Sign out
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    },

    // Get current user - waits for Firebase auth to initialize before resolving
    getCurrentUser: () => {
        return new Promise((resolve) => {
            // If auth is already initialized and we have a user, resolve immediately
            if (auth.currentUser) {
                UserService.getUser(auth.currentUser.uid)
                    .then((userDoc) => resolve(userDoc || auth.currentUser))
                    .catch(() => resolve(auth.currentUser));
                return;
            }
            
            // Wait for auth state to be determined
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe(); // Unsubscribe after first call
                if (user) {
                    try {
                        const userDoc = await UserService.getUser(user.uid);
                        resolve(userDoc || user);
                    } catch {
                        resolve(user);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    },

    // Auth state listener - wraps firebase observer
    onAuthChange: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};