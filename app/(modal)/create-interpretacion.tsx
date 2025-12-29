import ButtonGroup from '@/components/ui/ButtonGroup'
import XButton from '@/components/ui/XButton'
import XCheckbox from '@/components/ui/XCheckbox'
import useActuacion from '@/hooks/useActuacion'
import useComposiciones from '@/hooks/useComposiciones'
import useId from '@/hooks/useId'
import useRepertorio from '@/hooks/useRepertorio'
import useMapInitialization from '@/hooks/useMapInitialization'
import { Composicion, Interpretacion } from '@/models/interfaces'
import { router } from 'expo-router'
import { useGlobalSearchParams } from 'expo-router/build/hooks'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  InputAccessoryView,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { Region } from 'react-native-maps'
import * as Location from 'expo-location'
import Ionicons from '@expo/vector-icons/Ionicons'

const inputID = 'input'

const initialState: Interpretacion = {
  enlazada: 1,
  idInterpretacion: '',
  time: new Date(),
  compositor: '',
  idCompositor: undefined,
  nMarcha: undefined,
  tituloMarcha: '',
  ubicacion: '',
  url: '',
}
const CreateInterpretacion = () => {
  const [find, setFind] = useState<Composicion | undefined>(undefined)
  const [formData, setFormData] = useState<Interpretacion>(initialState)
  const { composiciones } = useComposiciones()

  const { id } = useGlobalSearchParams()
  const { actuacion } = useActuacion(id.toString())
  const { addInterpretacion, repertorio } = useRepertorio(id.toString())
  const insets = useSafeAreaInsets()

  // Hook personalizado para la inicialización del mapa
  const { mapRegion, coordinates, setCoordinates, loadingLocation, initialUbicacion } =
    useMapInitialization({ actuacion, repertorio })

  // Actualizar el formulario cuando se inicializa la ubicación
  const [isInitialized, setIsInitialized] = useState(false)

  if (!isInitialized && initialUbicacion && !loadingLocation) {
    setFormData(prev => ({ ...prev, ubicacion: initialUbicacion }))
    setIsInitialized(true)
  }

  const handleChangeText = useCallback(
    (e: string) => {
      if (!e) {
        setFind(undefined)
        return
      }
      const next = composiciones?.find(f => f.idFirebase === e)
      setFind(prev => (prev === next ? prev : next)) // evita set innecesario
    },
    [composiciones]
  )

  const handleSubmit = () => {
    if (!find) {
      alert('Introduce una composición')
      return
    }
    const id = useId()
    const selection: Interpretacion = {
      idInterpretacion: id,
      time: new Date(),
      compositor: find.compositor,
      idCompositor: find.idCompositor,
      nMarcha: +find.idComposicion,
      enlazada: formData?.enlazada ? 0 : 1,
      tituloMarcha: find.titulo,
      ubicacion: formData?.ubicacion,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    }

    console.log(selection)

    addInterpretacion({ data: selection })
  }

  const handleEditUbicacion = (e: string) => {
    if (e !== undefined) {
      setFormData({ ...formData, ubicacion: e })
    }
  }

  const handleMapRegionChange = async (region: Region) => {
    setCoordinates({ latitude: region.latitude, longitude: region.longitude })

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: region.latitude,
        longitude: region.longitude,
      })

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0]
        const streetName =
          address.street || address.name || 'Ubicación desconocida'
        setFormData(prev => ({ ...prev, ubicacion: streetName }))
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
    }
  }

  const handleChangeEnlazada = (e: boolean) => {
    setFormData(prev => (prev ? { ...prev, enlazada: e ? 1 : 0 } : prev))
  }

  const operation = (op: '+' | '-') => {
    if (find?.idFirebase === undefined) return
    const findElement =
      op === '+' ? String(+find.idFirebase! + 1) : String(+find.idFirebase! - 1)
    const next = composiciones?.find(f => f.idFirebase === findElement)
    setFind(prev => (prev === next ? prev : next))
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={140}>
        <ButtonGroup buttons={['En repertorio', 'Externa']} />
        <View style={styles.section}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            inputAccessoryViewID={inputID}
            style={styles.textField}
            onChangeText={handleChangeText}
            keyboardType="decimal-pad"
            autoFocus
            placeholder="0"
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            inputAccessoryViewID={inputID}
            style={styles.textField}
            onChangeText={handleEditUbicacion}
            value={formData.ubicacion}
            placeholder="Calle..."
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>
        {loadingLocation ? (
          <View style={styles.mapContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : mapRegion ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              onRegionChangeComplete={handleMapRegionChange}
            />
            <View style={styles.mapMarker}>
              <Text style={styles.mapMarkerIcon}>📍</Text>
            </View>
          </View>
        ) : null}
        {find && <FindBox data={find} />}
        <View style={styles.section}>
          <XCheckbox
            label="Enlazada"
            size="lg"
            value={formData?.enlazada == 0 ? false : true}
            onValueChange={handleChangeEnlazada}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.confirmButton} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </Pressable>
        </View>
        <InputAccessoryView nativeID={inputID}>
          <View style={styles.inputAccessoryView}>
            <XButton
              buttonStyle={styles.operationButton}
              textStyle={styles.operationButtonText}
              label="-"
              onPress={() => operation('-')}
            />
            <XButton
              buttonStyle={styles.operationButton}
              textStyle={styles.operationButtonText}
              label="+"
              onPress={() => operation('+')}
            />
          </View>
        </InputAccessoryView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
export default CreateInterpretacion

const styles = StyleSheet.create({
  label: {
    fontWeight: 600,
    fontSize: 16,
  },
  section: {
    margin: 5,
    padding: 5,
  },
  textField: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#94A3B8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 5,
    fontSize: 16,
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    zIndex: 1,
    pointerEvents: 'none',
  },
  mapMarkerIcon: {
    fontSize: 40,
  },
  findBox: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    boxShadow: [
      {
        color: 'lightgray',
        offsetX: 0,
        offsetY: 0,
        spreadDistance: 1,
        blurRadius: 5,
      },
    ],
    borderColor: 'gray',
  },
  findTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  findComposer: {
    textAlign: 'center',
  },
  checkbox: {
    margin: 10,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputAccessoryView: {
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 2,
  },
  operationButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  operationButtonText: { color: 'black' },
})

type FindBoxProps = {
  data: Composicion
}

const FindBox = ({ data }: FindBoxProps) => {
  return (
    <View style={styles.findBox}>
      <Text style={styles.findTitle}>{data.titulo}</Text>
      <Text style={styles.findComposer}>{data.compositor}</Text>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 20,
          marginTop: 10,
        }}>
        <Text>{data.idFirebase}</Text>
        {data.idFirebase != data.idComposicion && (
          <Text>{data.idComposicion}</Text>
        )}
      </View>
    </View>
  )
}
