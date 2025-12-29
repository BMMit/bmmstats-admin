import { Actuacion } from "@/models/interfaces"
import { getEvent } from "@/services/firebase"
import { useEffect, useState } from "react"

const useActuacion = (id: string) => {
  const [actuacion, setActuacion] = useState<Actuacion>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getActuacion(id)
  }, [])

  const getActuacion = (id: string) => {
    try {
      setLoading(true)
      getEvent(id, (data) => {
        if (data) {
          setActuacion(data)
        }
      })
      setLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return { actuacion, actuacionLoading: loading }
}

export default useActuacion