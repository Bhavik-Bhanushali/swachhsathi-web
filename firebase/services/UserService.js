
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
import {db} from '../config'

// export interface UserData {
//   uid: string;
//   email: string;
//   name?: string;
//   phone?: string;
//   role?: 'user' | 'worker' | 'admin';
//   createdAt?: FirebaseFirestoreTypes.Timestamp;
//   updatedAt?: FirebaseFirestoreTypes.Timestamp;
// }

class UserService {
   collectionName = 'users';

  // Create user document
  async createUser(uid, userData) {
    const userRef = doc(collection(db, this.collectionName), uid);

    return setDoc(userRef, {
      ...userData,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Update user document
  async updateUser(uid, userData) {
    const userRef = doc(collection(db, this.collectionName), uid);

    return updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  }

  // Get all workers
  async getWorkers() {
    const usersRef = collection(db, this.collectionName);
    const workersQuery = query(usersRef, where('role', '==', 'worker'));
    const snapshot = await getDocs(workersQuery);

    return snapshot.docs.map(docSnap => docSnap.data());
  }

  // Get user document
  async getUser(uid) {
    const userRef = doc(collection(db, this.collectionName), uid);
    const docSnap = await getDoc(userRef);

    return docSnap.exists ? (docSnap.data()) : null;
  }
}

export default new UserService();