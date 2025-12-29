import { Alert } from "react-native"

type AlertProps = {
  field: "ubicacion" | "enlazada" | "eliminar"
}

type DictionaryType = {
  field: {
    title: string,
    subtitle: string
  }
}

export const handleEditInterpretation = (id: string) => {
  return Alert.alert("Actualizar",
    "¿Qué elemento deseas actualizar?",
    [
      {
        text: "Ubicación",
        onPress: () => {
          const result = promptAlert({ field: 'ubicacion' })
          return result
        }
      },
      {
        text: "Marcar como enlazada",
        onPress: () => { return id }
      },
      {
        text: "Eliminar"
      },
      {
        text: "Cancelar",
        style: 'destructive'
      }
    ]
  )
}

const promptAlert = ({ field }: AlertProps) => {
  Alert.prompt(dictionary[field].title,
    dictionary[field].subtitle,
    [
      {
        text: 'Cancelar',
        style: 'destructive'
      },
      {
        text: 'Aceptar',
        onPress: (e) => { return e }
      }
    ]
  )
}

const dictionary: any = {
  "ubicacion": {
    "title": 'Ubicación',
    "subtitle": 'Introduzca la nueva ubicación'
  },
  "enlazada": {
    "title": '',
    "subtitle": ''
  }
}