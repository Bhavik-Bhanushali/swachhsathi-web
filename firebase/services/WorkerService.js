import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../config';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
// export interface CreateWorkerData {
//   email: string;
//   password: string;
//   name: string;
//   phone: string;
//   ngoId: string;
// }

class WorkerService {
    // Create worker account via Cloud Function
    async createWorker(workerData) {
        try {
            const createWorkerFn = httpsCallable(functions, 'createWorker');
            const result = await createWorkerFn(workerData);
            return result.data;
        } catch (error) {
            console.error('Create worker error:', error);
            throw error;
        }
    }


    // Get all workers for a specific NGO with real-time updates
    getWorkers(ngoId, onWorkersUpdated, onError) {
        try {
            const q = query(
                collection(db, 'users'),
                where('ngoId', '==', ngoId),
                where('role', '==', 'worker')
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const workers = [];
                querySnapshot.forEach((doc) => {
                    console.log(doc.id);
                    
                    workers.push({ id: doc.id, ...doc.data(), isActive: doc.data().isActive || false });
                });
                console.log(workers);
                
                onWorkersUpdated(workers);
            }, (error) => {
                console.error('Get workers error:', error);
                if (onError) onError(error);
            });

            return unsubscribe;

        } catch (error) {
            console.error('Setup workers listener error:', error);
            throw error;
        }
    }

    // Get worker by ID
    async getWorkerById(workerId) {
        try {
            const workerDoc = await getDoc(doc(db, 'users', workerId));
            
            if (!workerDoc.exists()) {
                throw new Error('Worker not found');
            }

            return {
                id: workerDoc.id,
                ...workerDoc.data()
            };
        } catch (error) {
            console.error('Get worker by ID error:', error);
            throw error;
        }
    }
}

export default new WorkerService();
