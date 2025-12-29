import { Composicion } from '@/models/interfaces'
import { getAllComposiciones } from '@/services/firebase'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Unsubscribe = () => void

const useComposiciones = () => {
  const [composiciones, setComposiciones] = useState<Composicion[] | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(true)

  const reload = useCallback((): Unsubscribe | void => {
    setLoading(true)

    try {
      const unsub = getAllComposiciones((data?: Composicion[] | null) => {
        setComposiciones(data ?? undefined)
        setLoading(false)
      })

      return unsub as Unsubscribe | void
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const unsub = reload()
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [reload])

  return useMemo(
    () => ({ composiciones, loading, reload }),
    [composiciones, loading, reload]
  )
}

export default useComposiciones
