import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../config';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
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
                where('ngoId', '==', ngoId)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const workers = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Optional: Double check role if needed, but ngoId presence implies association
                    if (data.role === 'worker') {
                        workers.push({ id: doc.id, ...data });
                    }
                });
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
}

export default new WorkerService();
