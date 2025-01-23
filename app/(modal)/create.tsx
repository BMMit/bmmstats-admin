import { Actuacion } from '@/models/interfaces';
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Stack, Tabs } from 'expo-router'
import { useRef, useState } from 'react';
import { InputAccessoryView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { dictionary } from '@/models/constants';


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

  const [isPickerVisible, setPickerVisible] = useState(false);
  const fieldToUpdate: any = useRef('')

  const fields = [
    { name: 'organizador1', label: 'Organizador', icon: 'person' },
    { name: 'organizador2', label: 'Organizador 2', icon: 'person-outline' },
    { name: 'ciudad', label: 'Ciudad', icon: 'map' },
    { name: 'ubicacion', label: 'Ubicación', icon: 'business' }
  ]

  const handleChangeText = (name: string, value: string) => {
    setState({ ...state, [name]: value });
  };

  const handleFocus = (fieldName: string) => {
    fieldToUpdate.current = fieldName;
    setPickerVisible(true)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}
        placeholder='Nueva actuación' autoFocus placeholderTextColor='gray'
        onChangeText={(value) => handleChangeText('concepto', value)}
      />

      // Text fields
      {fields.map((field) => (
        <View key={field.name} style={styles.section}>
          <View style={styles.sectionLabel}>
            <Ionicons name={field.icon as keyof typeof Ionicons.glyphMap} size={16} style={{ marginRight: 5 }} />
            <Text style={styles.labelText}>{field.label}</Text>
          </View>
          <TextInput
            placeholder='Vacío'
            style={[styles.input]}
            onChangeText={(value) => handleChangeText(field.name, value)}
            placeholderTextColor='gray'
            onFocus={() => handleFocus(field.name)}
          />
        </View>
      ))}
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          <Ionicons name='list' size={16} style={{ marginRight: 5 }} />
          <Text style={styles.labelText}>Tipo</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleFocus('tiposActuaciones')}
          style={styles.input}
        >
          <Text style={{ color: 'gray', fontSize: 18, fontWeight: '400' }}>
            {state.tipoActuacion || 'Seleccionar...'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          <Ionicons name='pricetag' size={16} style={{ marginRight: 5 }} />
          <Text style={styles.labelText}>Tag</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleFocus('tagsActuaciones')}
          style={styles.input}
        >
          <Text style={{ color: 'gray', fontSize: 18, fontWeight: '400' }}>
            {state.tipoActuacion || 'Seleccionar...'}
          </Text>
        </TouchableOpacity>
      </View>
      {isPickerVisible && (
        <InputAccessoryView style={{ marginBottom: 50 }} nativeID={fieldToUpdate.current}>
          <Picker
            selectedValue={state[fieldToUpdate.current as keyof Actuacion]}
            onValueChange={(value: any) => {
              handleChangeText(fieldToUpdate.current, value);
              setPickerVisible(false); // Ocultar el picker al seleccionar un valor
            }}
          >
            {dictionary[fieldToUpdate.current].map((tipo: any) => (
              <Picker.Item color='black' key={tipo.label} label={tipo.label} value={tipo.value} />
            ))}
          </Picker>
        </InputAccessoryView>
      )}
    </View>
  )
}
export default create
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});