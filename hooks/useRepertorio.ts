import { Interpretacion } from "@/models/interfaces"
import { getRepertorio } from "@/services/firebase"
import { useEffect, useState } from "react"

const useRepertorio = (id: string) => {
  const [repertorio, setRepertorio] = useState<Interpretacion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getListado()
  }, [])

  const getListado = async () => {
    try {
      setLoading(true)
      const unsub = getRepertorio(id, (data) => {
        setRepertorio(data.reverse());
      });

      return () => unsub();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const addInterpretacion = ({ data }: { data: Interpretacion }) => {
    console.log(data);

  }
  return { loadingRepertorio: loading, repertorio, addInterpretacion }
}

export default useRepertorio