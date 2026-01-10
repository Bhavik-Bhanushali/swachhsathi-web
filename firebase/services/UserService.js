import { db } from "../config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// UserProfile {
//     uid: string;
//     email: string;
//     displayName: string;
//     role: 'admin' | 'worker' | 'user';
//     createdAt: any;
//     phoneNumber?: string;
//     photoURL?: string;
//     isProfileSetUp?: boolean;
// }


export const UserService = {
    // Create or overwrite a user document in 'users' collection
    createUser: async (user)=> {
        try {
            await setDoc(doc(db, "users", user.uid), user);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Get a user profile by UID
    getUser: async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    },

    // Update specific fields of a user profile
    updateUser: async (uid, data) => {
        try {
            await updateDoc(doc(db, "users", uid), data);
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
};