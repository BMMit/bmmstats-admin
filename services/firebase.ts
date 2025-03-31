import { firestore } from "@/database/firebase"
import { Actuacion } from "@/models/interfaces";
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export const getAllEvents = async () => {

  let actuaciones: Actuacion[] = [];
  const actuacionesRef = collection(firestore, 'actuaciones')

  const q = query(actuacionesRef, orderBy('fecha', "desc"))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    actuaciones.push(doc.data() as Actuacion)
  })

  return actuaciones
}