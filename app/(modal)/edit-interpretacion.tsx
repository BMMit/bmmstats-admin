import useInterpretacion from '@/hooks/useInterpretacion'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker'
// import { convertStringDateToDate } from "@/helpers/utils";

const EditInterpretacion = () => {
  const { actuacionId, interpretacionId } = useLocalSearchParams()
  const insets = useSafeAreaInsets()

  const { interpretacion, loading } = useInterpretacion(
    actuacionId as string,
    interpretacionId as string
  )

  if (loading) {
    return <ActivityIndicator color="black" />
  }

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom }}>
      <Stack.Screen options={{ title: 'Editar interpretacion' }} />

      {/* Título */}
      <View style={styles.section}>
        <Text style={[styles.labelText, styles.sectionLabel]}>Título</Text>
        <TextInput style={styles.input} value={interpretacion?.tituloMarcha} />
      </View>

      {/* Ubicación */}
      <View style={styles.section}>
        <Text style={[styles.labelText, styles.sectionLabel]}>Ubicación</Text>
        <TextInput style={styles.input} value={interpretacion?.ubicacion} />
      </View>

      {/* Ubicación */}
      <View style={styles.section}>
        <Text style={[styles.labelText, styles.sectionLabel]}>Hora</Text>
        {/* <DateTimePicker
          value={convertStringDateToDate(interpretacion?.time!)}
          mode="datetime"
        /> */}
      </View>

      <Pressable style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </Pressable>
    </View>
  )
}
export default EditInterpretacion

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  sectionLabel: {
    flex: 1, // Ocupa la primera columna
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  labelText: {
    fontSize: 17,
    fontWeight: '400',
  },
  input: {
    flex: 2, // Ocupa la segunda columna
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: '400',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: 'black',
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 'auto',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
})
