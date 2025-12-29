import { View, Text, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

import { Interpretacion } from '@/models/interfaces'

interface InterpretacionItemProps {
  item: Interpretacion
  onEdit: () => void
  onUbicacionTouch: (value: string) => void
}

export default function InterpretacionItem({ item, onEdit, onUbicacionTouch }: InterpretacionItemProps) {
  const tiempo = String(item.time).slice(0, -3).slice(item.time.toString().indexOf(',') + 2)
  const url = item.url?.substring(item.url.lastIndexOf('/'))

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nMarcha || '#'}</Text>

      <View style={[styles.column, { width: item.url ? '75%' : '45%' }]}>
        <Text numberOfLines={1} style={styles.title}>{item.url || item.tituloMarcha}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{item.url ? url : item.compositor}</Text>
      </View>

      {!item.url && (
        <Text onPress={() => onUbicacionTouch(item.ubicacion!)} style={styles.ubicacion}>{item.ubicacion}</Text>
      )}

      <Text numberOfLines={1} style={styles.tiempo}>{tiempo}</Text>

      <Ionicons size={20} name='pencil' onPress={onEdit} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 5, paddingHorizontal: 15, gap: 2, alignItems: 'center' },
  cell: { width: '7%' },
  column: { flexDirection: 'column', width: '10%' },
  title: { fontWeight: '500', fontSize: 13 },
  subtitle: { fontWeight: '300', fontSize: 12 },
  ubicacion: { width: '30%', fontSize: 12, textAlign: 'left' },
  tiempo: { width: '10%', textAlign: 'center', fontSize: 12 },
})
