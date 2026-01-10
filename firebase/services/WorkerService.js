import { httpsCallable } from 'firebase/functions';
import {functions} from '../config'

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
}

export default new WorkerService();
