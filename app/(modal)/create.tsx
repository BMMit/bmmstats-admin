import { Actuacion } from '@/models/interfaces';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack } from 'expo-router'
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActionSheetIOS, Pressable, Keyboard, SafeAreaView } from 'react-native'
import { dictionary } from '@/models/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

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

  const fields = [
    { name: 'organizador1', label: 'Organizador', icon: 'person' },
    { name: 'organizador2', label: 'Organizador 2', icon: 'person-outline' },
    { name: 'ciudad', label: 'Ciudad', icon: 'map' },
    { name: 'ubicacion', label: 'Ubicación', icon: 'business' }
  ]
  const tags = ['Cancelar', 'Semana Santa', 'Glorias', 'Extraordinaria']
  const tipos = ['Cancelar', 'Procesión', 'Concierto', 'Pregón']
  const blurhash = '00IEtj'

  const handleChangeText = (name: string, value: string | Date) => {
    setState({ ...state, [name]: value });
  };

  const handlePicker = (field: string) => {
    Keyboard.dismiss()
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: field === 'tagActuacion' ? tags : tipos,
        cancelButtonIndex: 0,
        tintColor: 'black',
        title: field === 'tagActuacion' ? 'Tag de actuación' : 'Tipo de actuación',

      },
      buttonIndex => {
        if (buttonIndex !== 0) {
          handleChangeText(field, dictionary[field][buttonIndex - 1].value)
        }
      }
    )
  }

  // TODO
  // handleImagePicker

  const handleImagePicker = async () => {
    console.log('tapped')

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'livePhotos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.canceled && result.assets[0].uri) {
        console.log(result.assets[0].uri)
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleDatePicker = (date: Date) => {
    setState({ ...state, 'fecha': date })
  }

  const handleSave = () => {
    console.log(state);
  }

  const headerRight = () => {
    return (
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Crear</Text>
      </Pressable>
    )
  }

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerRight: () => headerRight() }} />
      <View style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            onTouchEnd={handleImagePicker}
            source={{ uri: state.coverImage }}
            placeholder={{ blurhash }}
            style={{ zIndex: 2, height: 40, width: 40, borderRadius: 40 }} />
          <TextInput
            // onPress={handleImagePicker} TODO
            style={{ fontSize: 24, fontWeight: 'bold' }}
            placeholder='Nueva actuación' autoFocus placeholderTextColor='gray'
            onChangeText={(value) => handleChangeText('concepto', value)}
          />
        </View>

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
          <View style={[styles.input, { alignContent: 'flex-start' }]}>
            <DateTimePicker
              style={{ start: 0 }}
              testID="dateTimePicker"
              value={state.fecha}
              mode={'datetime'}
              onChange={(value) => handleDatePicker(new Date(value.nativeEvent.timestamp))}
            />
          </View>
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
    height: '90%',
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
  inputText: { color: 'gray', fontSize: 18, fontWeight: '400' },
  saveButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#18181b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fafafa',
    borderRadius: 8,
    justifyContent: 'center',
    alignContent: 'center',
  },
  saveButtonText: {
    color: '#fafafa',
    fontWeight: 500,
  }
});