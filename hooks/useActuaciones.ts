import { Actuacion } from '@/models/interfaces'
import { getAllEvents } from '@/services/firebase'
import { useEffect, useState } from 'react'

const useActuaciones = () => {
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getActuaciones()
  }, [])

  const getActuaciones = async () => {
    try {
      setLoading(true)
      getAllEvents((data) => {
        setActuaciones(data)
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { actuaciones, loading }
}

export default useActuaciones
