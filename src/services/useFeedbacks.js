import { db } from "../firebaseConfig";
import { collection, onSnapshot, getDocs } from "firebase/firestore";

// Nombre de colección constante para evitar inconsistencias
const COLLECTION_NAME = "feedback";

const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    try {
      const unsubscribe = onSnapshot(
        collection(db, COLLECTION_NAME), 
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timeStamp: doc.data().timeStamp instanceof Date 
              ? doc.data().timeStamp.toISOString() 
              : doc.data().timeStamp
          }));
          
          setFeedbacks(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("Error en la suscripción:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error configurando la suscripción:", err);
      setError(err.message);
      setLoading(false);
      // Retornar una función de limpieza vacía para evitar errores
      return () => {};
    }
  }, []);

  return { feedbacks, loading, error };
};

export default useFeedbacks;

