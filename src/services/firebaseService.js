// src/services/firebaseService.js
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const COLLECTION_NAME = "feedback";

// Función para guardar feedback
export const saveFeedback = async (feedbackData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    // Si no hay un userId en los datos pasados, usamos el del usuario autenticado
    if (!feedbackData.userId && user) {
      feedbackData.userId = user.uid;
    }
    
    // Aseguramos que haya un timestamp si no fue proporcionado
    if (!feedbackData.timeStamp) {
      feedbackData.timeStamp = serverTimestamp();
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), feedbackData);
    console.log("Feedback guardado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar feedback: ", error);
    throw error;
  }
};

// Función para obtener todos los datos de feedback
export const fetchAllFeedback = async () => {
  try {
    const feedbackCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(feedbackCollection);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Asegúrate de que timeStamp sea un string para facilitar el procesamiento
      timeStamp: doc.data().timeStamp instanceof Date 
        ? doc.data().timeStamp.toISOString() 
        : doc.data().timeStamp
    }));
  } catch (error) {
    console.error("Error al obtener datos de feedback:", error);
    throw error;
  }
};