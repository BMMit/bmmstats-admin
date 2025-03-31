import { Actuacion } from '@/models/interfaces'
import { getAllEvents } from '@/services/firebase'
import { useEffect, useRef, useState } from 'react'

const useActuaciones = () => {
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([])
  const [loading, setLoading] = useState(false)
  const hasFetched = useRef(false) // 👈 evita fetch repetido por hot reload

  useEffect(() => {
    if (hasFetched.current) return

    hasFetched.current = true
    getActuaciones()
  }, [])

  const getActuaciones = async () => {
    try {
      setLoading(true)
      const events = await getAllEvents()
      setActuaciones(events)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { actuaciones, loading }
}

export default useActuaciones
