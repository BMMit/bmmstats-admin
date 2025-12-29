import { Actuacion, Interpretacion } from '@/models/interfaces'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { Region } from 'react-native-maps'

// Constante para el nivel de zoom del mapa
const MAP_ZOOM_DELTA = 0.0007

interface UseMapInitializationProps {
  actuacion: Actuacion | null | undefined
  repertorio: Interpretacion[] | null | undefined
}

interface UseMapInitializationReturn {
  mapRegion: Region | null
  coordinates: { latitude: number; longitude: number } | null
  setCoordinates: (coords: { latitude: number; longitude: number } | null) => void
  loadingLocation: boolean
  initialUbicacion: string | undefined
}

/**
 * Hook personalizado para inicializar el mapa con la ubicación correcta.
 *
 * Prioridad de ubicación:
 * 1. Coordenadas de la última interpretación
 * 2. Geocodificación de la ubicación de la última interpretación
 * 3. Geocodificación de la ubicación de la actuación
 */
export default function useMapInitialization({
  actuacion,
  repertorio,
}: UseMapInitializationProps): UseMapInitializationReturn {
  const [mapRegion, setMapRegion] = useState<Region | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [coordinates, setCoordinates] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [initialUbicacion, setInitialUbicacion] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const initializeLocation = async () => {
      setLoadingLocation(true)

      // Si hay repertorio, usar la última interpretación
      if (repertorio && repertorio.length > 0) {
        const lastInterpretacion = getLastInterpretacion(repertorio)

        // Caso 1: La última interpretación tiene coordenadas
        if (lastInterpretacion.latitude && lastInterpretacion.longitude) {
          setMapFromCoordinates(
            lastInterpretacion.latitude,
            lastInterpretacion.longitude,
            lastInterpretacion.ubicacion,
            setMapRegion,
            setCoordinates,
            setInitialUbicacion
          )
          setLoadingLocation(false)
          return
        }

        // Caso 2: La última interpretación tiene ubicación pero no coordenadas
        if (lastInterpretacion.ubicacion && actuacion?.ciudad) {
          const geocoded = await geocodeAddress(
            lastInterpretacion.ubicacion,
            actuacion.ciudad
          )

          if (geocoded) {
            setMapFromCoordinates(
              geocoded.latitude,
              geocoded.longitude,
              lastInterpretacion.ubicacion,
              setMapRegion,
              setCoordinates,
              setInitialUbicacion
            )
            setLoadingLocation(false)
            return
          }
        }
      }

      // Caso 3: Geocodificar la ubicación de la actuación
      if (actuacion?.ubicacion && actuacion?.ciudad) {
        const geocoded = await geocodeAddress(
          actuacion.ubicacion,
          actuacion.ciudad
        )

        if (geocoded) {
          setMapFromCoordinates(
            geocoded.latitude,
            geocoded.longitude,
            actuacion.ubicacion,
            setMapRegion,
            setCoordinates,
            setInitialUbicacion
          )
        }
      }

      setLoadingLocation(false)
    }

    initializeLocation()
  }, [actuacion?.ubicacion, actuacion?.ciudad, repertorio])

  return { mapRegion, coordinates, setCoordinates, loadingLocation, initialUbicacion }
}

/**
 * Obtiene la última interpretación del repertorio ordenada por fecha
 */
function getLastInterpretacion(repertorio: Interpretacion[]): Interpretacion {
  const sortedRepertorio = [...repertorio].sort((a, b) => {
    const timeA =
      a.time instanceof Date ? a.time.getTime() : new Date(a.time).getTime()
    const timeB =
      b.time instanceof Date ? b.time.getTime() : new Date(b.time).getTime()
    return timeB - timeA // Más reciente primero
  })

  return sortedRepertorio[0]
}

/**
 * Geocodifica una dirección combinando ubicación y ciudad
 */
async function geocodeAddress(
  ubicacion: string,
  ciudad: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${ubicacion}, ${ciudad}`
    console.log('🔍 Buscando dirección:', fullAddress)
    const geocoded = await Location.geocodeAsync(fullAddress)

    if (geocoded && geocoded.length > 0) {
      return {
        latitude: geocoded[0].latitude,
        longitude: geocoded[0].longitude,
      }
    }

    console.log('❌ No se encontraron resultados de geocodificación')
    return null
  } catch (error) {
    console.error('❌ Error geocoding location:', error)
    return null
  }
}

/**
 * Crea una región de mapa y actualiza los estados correspondientes
 */
function setMapFromCoordinates(
  latitude: number,
  longitude: number,
  ubicacion: string | undefined,
  setMapRegion: (region: Region) => void,
  setCoordinates: (coords: { latitude: number; longitude: number }) => void,
  setInitialUbicacion: (ubicacion: string | undefined) => void
) {
  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: MAP_ZOOM_DELTA,
    longitudeDelta: MAP_ZOOM_DELTA,
  }

  setMapRegion(region)
  setCoordinates({ latitude, longitude })
  setInitialUbicacion(ubicacion)
}
