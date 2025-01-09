import { db } from '../backend/firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

// Add a new report
export const addReport = async (reportData) => {
  try {
    const reportsRef = collection(db, 'reports');
    const docRef = await addDoc(reportsRef, reportData);
    return docRef;
  } catch (error) {
    console.error('Error adding report:', error);
    throw error;
  }
};

// Get reports for a specific user
export const getUserReports = async (studentNumber) => {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef, 
      where('studentNumber', '==', studentNumber),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reports;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
};

// Update report status
export const updateReportStatus = async (reportId, status, adminResponse = '') => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status,
      adminResponse,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

// Delete reports
export const deleteReports = async (reportIds) => {
  try {
    const batch = writeBatch(db);
    reportIds.forEach(id => {
      const reportRef = doc(db, 'reports', id);
      batch.delete(reportRef);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting reports:', error);
    throw error;
  }
}; 