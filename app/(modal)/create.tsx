import { Actuacion } from '@/models/interfaces';
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Stack, Tabs } from 'expo-router'
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActionSheetIOS, Pressable, Keyboard, SafeAreaView } from 'react-native'
import { dictionary } from '@/models/constants';
import DateTimePicker from '@react-native-community/datetimepicker';


const create = () => {

  const [state, setState] = useState<Actuacion>({
    concepto: "",
    fecha: new Date(),
    idActuacion: "",
    idRepertorio: "",
    isLive: false,
    organizador1: "",
    organizador2: "",
    tipoActuacion: "",
    ubicacion: "",
    ciudad: "",
    tagActuacion: "",
    coverImage: ""
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false)

  const fields = [
    { name: 'organizador1', label: 'Organizador', icon: 'person' },
    { name: 'organizador2', label: 'Organizador 2', icon: 'person-outline' },
    { name: 'ciudad', label: 'Ciudad', icon: 'map' },
    { name: 'ubicacion', label: 'Ubicación', icon: 'business' }
  ]
  const tags = ['Cancelar', 'Semana Santa', 'Glorias', 'Extraordinaria']
  const tipos = ['Cancelar', 'Procesión', 'Concierto', 'Pregón']

  const handleChangeText = (name: string, value: string | Date) => {
    setState({ ...state, [name]: value });
  };

  const handlePicker = (field: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: field === 'tagActuacion' ? tags : tipos,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex !== 0) {
          handleChangeText(field, dictionary[field][buttonIndex - 1].value)
        }
      }
    )
  }

  const handleDatePicker = () => {
    Keyboard.dismiss()
    setDatePickerVisible(true)
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}
          placeholder='Nueva actuación' autoFocus placeholderTextColor='gray'
          onChangeText={(value) => handleChangeText('concepto', value)}
        />

        {/* Text fields */}
        {fields.map((field) => (
          <View key={field.name} style={styles.section}>
            <View style={styles.sectionLabel}>
              <Ionicons name={field.icon as keyof typeof Ionicons.glyphMap} size={16} style={{ marginRight: 5 }} />
              <Text style={styles.labelText}>{field.label}</Text>
            </View>
            <TextInput
              placeholder='Vacío'
              style={styles.input}
              onChangeText={(value) => handleChangeText(field.name, value)}
              placeholderTextColor='gray'
            />
          </View>
        ))}

        {/* Fecha */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Ionicons name='calendar' size={16} style={{ marginRight: 5 }} />
            <Text style={styles.labelText}>Fecha</Text>
          </View>
          <TouchableOpacity style={styles.input} onPress={handleDatePicker}>
            <Text style={styles.inputText}>{state.fecha.toLocaleString('es-ES', { timeStyle: 'short', dateStyle: 'medium' })}</Text>
          </TouchableOpacity>
        </View>

        {/* Tipo actuación */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Ionicons name='list' size={16} style={{ marginRight: 5 }} />
            <Text style={styles.labelText}>Tipo</Text>
          </View>
          <TouchableOpacity
            onPress={() => handlePicker('tipoActuacion')}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {state.tipoActuacion || 'Seleccionar...'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tag actuación */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Ionicons name='pricetag' size={16} style={{ marginRight: 5 }} />
            <Text style={styles.labelText}>Tag</Text>
          </View>
          <TouchableOpacity
            onPress={() => handlePicker('tagActuacion')}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {state.tagActuacion || 'Seleccionar...'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date picker */}
        <DateTimePicker
          testID="dateTimePicker"
          value={state.fecha}
          mode={'datetime'}
          onChange={() => console.log('here2')}
        />
      </View>
    </SafeAreaView>
  )
}
export default create
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sectionLabel: {
    flex: 1, // Ocupa la primera columna
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  labelText: {
    fontSize: 17,
    fontWeight: '400'
  },
  input: {
    flex: 2, // Ocupa la segunda columna
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'gray',
    fontSize: 18,
    fontWeight: '400',
  },
  inputText: { color: 'gray', fontSize: 18, fontWeight: '400' }
});