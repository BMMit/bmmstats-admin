import useActuaciones from '@/hooks/useActuaciones'
import { Actuacion, TAG_ACTUACIONES } from '@/models/interfaces'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
} from 'react-native'
import XText from './ui/XText'
import { router } from 'expo-router'
import { useCallback } from 'react'
import Cover from './ui/Cover'
import * as Clipboard from 'expo-clipboard'
import * as Sharing from 'expo-sharing'
import { Share } from 'react-native'
import * as Haptics from 'expo-haptics'

const List = () => {
  const { actuaciones, loading } = useActuaciones()

  const renderItem = useCallback(({ item }: { item: Actuacion }) => {
    const fecha = new Date(item.fecha.seconds * 1000)
      .toLocaleString()
      .slice(0, -3)

    const labelColor = () => {
      switch (item.tagActuacion) {
        case TAG_ACTUACIONES.SEMANA_SANTA:
          return '#d8b4fe'
        case TAG_ACTUACIONES.GLORIAS:
          return '#fcd34d'
        case TAG_ACTUACIONES.PROCESION_EXTRAORDINARIA:
          return '#7dd3fc'
        default:
          return '#d6d3d1'
      }
    }

    const copyLinkToClipboard = async () => {
      await Clipboard.setStringAsync(
        `https://estadisticas.municipaldemairena.com/actuaciones/${item.idActuacion}`
      ).then(() => {
        Alert.alert('¡Copiado!')
      })
    }

    const handleDelete = () => {
      Alert.alert(
        'Estás seguro que quieres eliminar esta actuación?',
        'Esta acción es irreversible',
        [
          {
            text: 'Eliminar',
            style: 'destructive',
            // TODO delete action
            onPress: () => console.log('eliminar'),
          },
          {
            text: 'No',
            isPreferred: true,
          },
        ]
      )
    }

    const shareEvent = () => {
      Share.share({
        url: `https://www.estadisticas.municipaldemairena.com/actuaciones/${item.idActuacion}`,
        title: 'Sharing',
        message: `${item.concepto}`,
      })
    }

    const handlePress = () => {
      router.push(`/detail/${item.idActuacion}`)
    }

    const handleLongPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      Alert.alert('Opciones', '', [
        {
          text: 'Copiar enlace',
          onPress: copyLinkToClipboard,
        },
        {
          text: 'Compartir',
          onPress: shareEvent,
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: handleDelete,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ])
    }

    return (
      <Pressable onPress={handlePress} onLongPress={handleLongPress}>
        <View style={styles.card}>
          <View style={{ backgroundColor: labelColor(), width: 10 }}></View>
          <View style={styles.cardContent}>
            <View>
              <XText
                color={item.isLive ? 'red' : 'black'}
                weight="bold"
                variant="title">
                {item.concepto}
              </XText>
              <XText weight="light" variant="subtitle" numberOfLines={2}>
                {item.organizador1}
              </XText>
            </View>
            <XText weight="light" variant="subtitle">
              {fecha}
            </XText>
          </View>

          <Cover uri={item.coverImage} />
        </View>
      </Pressable>
    )
  }, [])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="indigo" />
      </View>
    )
  }

  return (
    <FlatList
      data={actuaciones}
      renderItem={renderItem}
      keyExtractor={item => item.idActuacion}
      style={styles.list}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
    />
  )
}

export default List

const boxShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8, // rounded-2xl
    borderColor: '#e5e7eb', // Tailwind's gray-200
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 100,
    gap: 4,
    ...boxShadow,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 100,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loader: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
