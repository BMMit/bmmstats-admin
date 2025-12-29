import { Interpretacion } from "@/models/interfaces"
import { getInterpretacionItem } from "@/services/firebase"
import { useEffect, useState } from "react"

const useInterpretacion = (actuacionId: string, interpretacionId: string) => {

  const [interpretacion, setInterpretacion] = useState<Interpretacion>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInterpretacion()
  }, [])

  const getInterpretacion = () => {
    try {
      getInterpretacionItem(actuacionId, interpretacionId, (data) => {
        data ? setInterpretacion(data) : setInterpretacion(undefined)
      })
      setLoading(false)

    } catch (error) {
      console.error(error);
    }
  }

  return { interpretacion, loading }

}
export default useInterpretacion