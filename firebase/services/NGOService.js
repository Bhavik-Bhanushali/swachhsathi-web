
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../config';

// export interface NGOData {
//   ngoId: string; // Same as user's UID
//   ngoName: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   registrationNumber: string;
//   categories: string[];
//   status: 'pending' | 'approved' | 'rejected';
//   createdAt?: FirebaseFirestoreTypes.Timestamp;
//   updatedAt?: FirebaseFirestoreTypes.Timestamp;
//   adminId: string; // after user users'id
// }

class NGOService {
    collectionName = 'ngos';

    // Create NGO document
    async createNGO(ngoId, ngoData) {
        const ngoRef = doc(collection(db, this.collectionName), ngoId);

        return setDoc(ngoRef, {
            ...ngoData,
            ngoId,
            adminId: ngoId,
            status: 'approved', // Default status is pending
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    // Get NGO by ID
    async getNGO(ngoId) {
        if (!ngoId) {
            return null;
        }
        const ngoRef = doc(collection(db, this.collectionName), ngoId);
        const docSnap = await getDoc(ngoRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    }

    // Get all NGOs
    async getAllNGOs() {
        const ngosRef = collection(db, this.collectionName);
        const snapshot = await getDocs(ngosRef);

        return snapshot.docs.map(docSnap => docSnap.data());
    }

    // Get NGOs by status
    async getNGOsByStatus(status) {
        const ngosRef = collection(db, this.collectionName);
        const ngosQuery = query(ngosRef, where('status', '==', status));
        const snapshot = await getDocs(ngosQuery);

        return snapshot.docs.map(docSnap => docSnap.data());
    }

    // Update NGO status (for admin approval/rejection)
    async updateNGOStatus(ngoId, status) {
        const ngoRef = doc(collection(db, this.collectionName), ngoId);

        return updateDoc(ngoRef, {
            status,
            updatedAt: serverTimestamp(),
        });
    }

    // Update NGO details
    async updateNGO(ngoId, ngoData) {
        const ngoRef = doc(collection(db, this.collectionName), ngoId);

        return updateDoc(ngoRef, {
            ...ngoData,
            updatedAt: serverTimestamp(),
        });
    }
}

export default new NGOService();