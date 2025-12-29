import { Text, TextInput, View, Pressable, Image, StyleSheet, useWindowDimensions } from 'react-native'

import { Actuacion } from '@/models/interfaces'

interface ActuacionHeaderProps {
  actuacion: Actuacion
  inputs: {
    numero: string
    ubicacion: string
  }
  onChange: (value: string, field: 'numero' | 'ubicacion') => void
}

export default function ActuacionHeader({ actuacion, inputs, onChange }: ActuacionHeaderProps) {
  const dimensions = useWindowDimensions()
  const date = new Date(actuacion.fecha.seconds * 1000).toLocaleString().slice(0, -3)

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{actuacion.organizador1}</Text>
      <Text style={styles.subheaderText}>{actuacion.ubicacion}</Text>
      <Text style={styles.subheaderText}>{actuacion.ciudad}</Text>
      <Text style={styles.subheaderText}>{date}</Text>

      <View style={{ gap: 10 }}>
        <View style={styles.inputRow}>
          <TextInput
            autoFocus
            keyboardType="number-pad"
            style={styles.textInput}
            placeholder="Nº Marcha"
            value={inputs.numero}
            onChangeText={(e) => onChange(e, 'numero')}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Ubicación"
            clearButtonMode="always"
            onChangeText={(e) => onChange(e, 'ubicacion')}
            value={inputs.ubicacion}
          />
        </View>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </Pressable>
      </View>

      <Image source={{ uri: actuacion.coverImage }} style={[styles.coverImage, { width: dimensions.width, height: 200 }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: { gap: 4, padding: 15 },
  headerText: { fontWeight: '600', fontSize: 20, lineHeight: 28 },
  subheaderText: { fontSize: 14, color: '#4B5563' },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'white',
  },
  inputRow: { flexDirection: 'row', gap: 8 },
  addButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 10,
  },
  addButtonText: { textAlign: 'center', color: 'white' },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.15,
    zIndex: -1,
  },
})
