// import firestore from '@react-native-firebase/firestore';

import { functions, db } from '../config';
import { collection, query, where, getDocs, onSnapshot, orderBy, getDoc, doc, updateDoc } from 'firebase/firestore';

// export interface Report {
//   id: string;
//   userId: string;
//   userName: string;
//   userEmail: string;
//   category?: string;
//   description?: string;
//   imageUrl?: string;
//   location: {
//     address: string;
//     latitude: number;
//     longitude: number;
//   };
//   severity: 'Low' | 'Medium' | 'High';
//   status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
//   workerId?: string;
//   workerName?: string;
//   createdAt: any;
//   updatedAt: any;
// }

class ReportService {
   collectionName = 'reports';

  // Get all reports
  async getAllReports() {
    try {
        const q = query(
            collection(db, this.collectionName),
            orderBy('updatedAt', 'desc')
        );
      const snapshot = await getDocs(q);
      
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching all reports:', error);
      // Fallback: fetch without ordering
      const snapshot = await getDocs(collection(db, this.collectionName));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  }

  // Get user reports by userId
  async getUserReports(userId) {
    try {
      const snapshot = await getDocs(query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      ));
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching user reports:', error);
      // Fallback: fetch without ordering
      const snapshot = await getDocs(query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      ));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  }

  // Get single report by ID
  async getReport(reportId) {
    const document = await getDoc(doc(collection(db, this.collectionName), reportId));
    
    if (!document.exists) {
      return null;
    }
    
    return {
      id: document.id,
      ...document.data(),
    };
  }

  // Create new report
  async createReport(reportData) {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...reportData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return docRef.id;
  }

  // Update report status
  async updateReportStatus(
    reportId, 
    status,
    workerId,
    workerName
  ) {
    const updateData = {
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (workerId) {
      updateData.workerId = workerId;
    }
    
    if (workerName) {
      updateData.workerName = workerName;
    }

    await updateDoc(doc(collection(db, this.collectionName), reportId), updateData);
  }

  // Update report
  async updateReport(reportId, data) {
    await updateDoc(doc(collection(db, this.collectionName), reportId), {
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // Delete report
  async deleteReport(reportId) {
    await deleteDoc(doc(collection(db, this.collectionName), reportId));
  }

  // Get reports by status
  async getReportsByStatus(status) {
    const snapshot = await getDocs(query(
      collection(db, this.collectionName),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    ));
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Get worker reports
  async getWorkerReports(workerId) {
    const snapshot = await getDocs(query(
      collection(db, this.collectionName),
      where('workerId', '==', workerId),
      orderBy('createdAt', 'desc')
    ));
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export default new ReportService();