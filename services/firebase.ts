import { firestore, realtime } from "@/database/firebase"
import { Actuacion, Composicion } from "@/models/interfaces";
import { onValue, ref } from "firebase/database";
import { collection, doc, orderBy, query, onSnapshot, updateDoc } from "firebase/firestore"

export const getAllEvents = (callback: (actuaciones: Actuacion[]) => void) => {
  const actuacionesRef = collection(firestore, "actuaciones");
  const q = query(actuacionesRef, orderBy("fecha", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const actuaciones: Actuacion[] = [];
    querySnapshot.forEach((doc) => {
      actuaciones.push(doc.data() as Actuacion);
    });
    callback(actuaciones);
  });

  return unsubscribe;
};

export const getEvent = (id: string, callback: (data: Actuacion | null) => void) => {
  const unsub = onSnapshot(doc(firestore, "actuaciones", id), (doc) => {
    if (doc.exists()) {
      const actuacion = doc.data() as Actuacion;
      callback(actuacion);
    } else {
      callback(null);
    }
  });
  return unsub;
};

export const getRepertorio = (
  id: string,
  callback: (data: any[]) => void
) => {
  const repertorioRef = ref(realtime, 'repertorios/' + id);

  const unsubscribe = onValue(repertorioRef, (snapshot) => {
    const data = snapshot.val();
    const repertorio = data ? Object.values(data) : [];
    callback(repertorio);
  });

  return unsubscribe;
};

export const updateFieldInDocument = async (key: string, value: string | number | boolean, id: string) => {
  const actuacionRef = doc(firestore, 'actuaciones', id)
  updateDoc(actuacionRef, {
    [key]: value
  }).then((resp) => {
    console.log(resp);
  })

};

export const getInterpretacionItem = (idActuacion: string, idInterpretacion: string, callback: (data: any) => void) => {
  const interpretacionRef = ref(realtime, `repertorios/${idActuacion}/${idInterpretacion}`);

  const unsubscribe = onValue(interpretacionRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  return unsubscribe;
};

export const getAllComposiciones = (callback: (composiciones: Composicion[]) => void) => {
  const composicionesRef = collection(firestore, "composiciones")
  const q = query(composicionesRef, orderBy("idComposicion", 'asc'))

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const composiciones: Composicion[] = []
    querySnapshot.forEach((doc) => {
      composiciones.push({ ...doc.data() as Composicion, idFirebase: doc.id })
    })
    callback(composiciones)
  })

  return unsubscribe
}