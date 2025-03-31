import useActuaciones from '@/hooks/useActuaciones'
import { Actuacion } from '@/models/interfaces'
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import XText from './ui/XText'
import { router } from 'expo-router'

const List = () => {
  const { actuaciones, loading } = useActuaciones()

  const renderItem = ({ item }: { item: Actuacion }) => {
    const handlePress = () => {
      router.push("/(tabs)/detail")
    }

    return (
      <Pressable style={styles.card} onPress={handlePress}>
        <Image
          source={{ uri: item.coverImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <XText weight='bold' variant='title'>{item.concepto}</XText>
          <XText weight='light' variant='subtitle'>{item.organizador1}</XText>
        </View>
      </Pressable>
    )
  }

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <View>
      <FlatList
        data={actuaciones as Actuacion[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.idActuacion}
        style={styles.list}
      />
    </View>
  )
}

export default List

const boxShadow: ViewStyle = {
  shadowColor: 'black',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    ...boxShadow,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  list: {
    paddingHorizontal: 20,
  },
})
