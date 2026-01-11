import { db } from "../config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

class ReportService {
  collectionName = "reports";

  /* ---------------- GET ALL REPORTS ---------------- */
  async getAllReports() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("updatedAt", "desc")
      );
      const snapshot = await getDocs(q);

      return await Promise.all(
        snapshot.docs.map(async (reportDoc) => {
          let workerName = null;
          console.log(reportDoc.data().assignedTo);
          
          if (reportDoc.data().assignedTo) {
            const workerSnap = await getDoc(
              doc(db, "users", reportDoc.data().assignedTo)
            );
            if (workerSnap.exists()) {
              workerName = workerSnap.data().name;
            }
          }

          return {
            id: reportDoc.id,
            ...reportDoc.data(),
            workerName,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching all reports:", error);
      return [];
    }
  }

  /* ---------------- USER REPORTS ---------------- */
  async getUserReports(userId) {
    const snapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      )
    );

    return await Promise.all(
      snapshot.docs.map(async (reportDoc) => {
        let workerName = null;

        if (reportDoc.data().assignedTo) {
          const workerSnap = await getDoc(
            doc(db, "users", reportDoc.data().assignedTo)
          );
          if (workerSnap.exists()) {
            workerName = workerSnap.data().name;
          }
        }

        return {
          id: reportDoc.id,
          ...reportDoc.data(),
          workerName,
        };
      })
    );
  }

  /* ---------------- SINGLE REPORT ---------------- */
  async getReport(reportId) {
    const reportSnap = await getDoc(
      doc(db, this.collectionName, reportId)
    );

    if (!reportSnap.exists()) return null;

    const reportData = reportSnap.data();
    let workerName = null;
    let workerEmail = null;

    if (reportData.assignedTo) {
      const workerSnap = await getDoc(
        doc(db, "users", reportData.assignedTo)
      );
      if (workerSnap.exists()) {
        workerName = workerSnap.data().name;
        workerEmail = workerSnap.data().email;
      }
    }

    return {
      id: reportSnap.id,
      ...reportData,
      workerName,
      workerEmail,
    };
  }

  /* ---------------- CREATE REPORT ---------------- */
  async createReport(reportData) {
    const docRef = await addDoc(
      collection(db, this.collectionName),
      {
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  /* ---------------- UPDATE STATUS ---------------- */
  async updateReportStatus(reportId, status, workerId, workerName) {
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (workerId) updateData.assignedTo = workerId;
    if (workerName) updateData.workerName = workerName;

    await updateDoc(
      doc(db, this.collectionName, reportId),
      updateData
    );
  }

  /* ---------------- UPDATE REPORT ---------------- */
  async updateReport(reportId, data) {
    await updateDoc(
      doc(db, this.collectionName, reportId),
      {
        ...data,
        updatedAt: serverTimestamp(),
      }
    );
  }

  /* ---------------- DELETE REPORT ---------------- */
  async deleteReport(reportId) {
    await deleteDoc(
      doc(db, this.collectionName, reportId)
    );
  }

  /* ---------------- BY STATUS ---------------- */
  async getReportsByStatus(status) {
    const snapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )
    );

    return await Promise.all(
      snapshot.docs.map(async (reportDoc) => {
        let workerName = null;

        if (reportDoc.data().assignedTo) {
          const workerSnap = await getDoc(
            doc(db, "users", reportDoc.data().assignedTo)
          );
          if (workerSnap.exists()) {
            workerName = workerSnap.data().name;
          }
        }

        return {
          id: reportDoc.id,
          ...reportDoc.data(),
          workerName,
        };
      })
    );
  }

  /* ---------------- WORKER REPORTS ---------------- */
  async getWorkerReports(workerId) {
    const snapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("assignedTo", "==", workerId),
        orderBy("createdAt", "desc")
      )
    );

    const workerSnap = await getDoc(doc(db, "users", workerId));
    const workerName = workerSnap.exists()
      ? workerSnap.data().name
      : null;

    return snapshot.docs.map((reportDoc) => ({
      id: reportDoc.id,
      ...reportDoc.data(),
      workerName,
    }));
  }

  /* ---------------- NGO REPORTS ---------------- */
  async getReportsByNgoId(ngoId) {
    // Fetch reports assigned to this NGO
    const assignedSnapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("ngoId", "==", ngoId),
        orderBy("createdAt", "desc")
      )
    );

    // Fetch unassigned pending reports (no ngoId set yet)
    const pendingSnapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("status", "in", ["pending", "unassigned"]),
        orderBy("createdAt", "desc")
      )
    );

    // Combine both results, avoiding duplicates
    const assignedReportIds = new Set(assignedSnapshot.docs.map(doc => doc.id));
    const allDocs = [
      ...assignedSnapshot.docs,
      ...pendingSnapshot.docs.filter(doc => !assignedReportIds.has(doc.id))
    ];

    return await Promise.all(
      allDocs.map(async (reportDoc) => {
        let workerName = null;
        let workerEmail = null;

        if (reportDoc.data().assignedTo) {
          const workerSnap = await getDoc(
            doc(db, "users", reportDoc.data().assignedTo)
          );
          if (workerSnap.exists()) {
            workerName = workerSnap.data().name;
            workerEmail = workerSnap.data().email;
          }
        }

        return {
          id: reportDoc.id,
          ...reportDoc.data(),
          workerName,
            workerEmail,
        };
      })
    );
  }

  /* ---------------- ASSIGNED NGO REPORTS ---------------- */
  async getAssignedReports() {
    const snapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      )
    );

    return await Promise.all(
      snapshot.docs.map(async (reportDoc) => {
        let workerName = null;
        let workerEmail = null;

        if (reportDoc.data().assignedTo) {
          const workerSnap = await getDoc(
            doc(db, "users", reportDoc.data().assignedTo)
          );
          if (workerSnap.exists()) {
            workerName = workerSnap.data().name;
            workerEmail = workerSnap.data().email;
          }
        }

        return {
          id: reportDoc.id,
          ...reportDoc.data(),
          workerName,
          workerEmail,
        };
      })
    );
  }
}

export default new ReportService();
