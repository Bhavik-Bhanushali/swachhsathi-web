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

    // Get current user (synchronous check, mostly for initial state if already loaded)
    getCurrentUser: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return null;
        
        // Fetch user document from Firestore to get additional fields like 'type'
        const userDoc = await UserService.getUser(currentUser.uid);
        return userDoc || currentUser;
    },

    // Auth state listener - wraps firebase observer
    onAuthChange: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};