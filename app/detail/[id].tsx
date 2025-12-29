import InterpretacionItem from '@/components/InterpretacionItem'
import StickyActuacionHeader from '@/components/StickyActuacionHeader'
import useActuacion from '@/hooks/useActuacion'
import useRepertorio from '@/hooks/useRepertorio'
import { updateFieldInDocument } from '@/services/firebase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated'

export default function DetailScreen() {
  const { id } = useLocalSearchParams()
  const { actuacion, actuacionLoading } = useActuacion(id.toString())
  const { repertorio, loadingRepertorio } = useRepertorio(id.toString())

  const scrollY = useSharedValue(0)
  const pingScale = useSharedValue(1)
  const pingOpacity = useSharedValue(1)

  useEffect(() => {
    if (actuacion?.isLive) {
      pingScale.value = 0.2
      pingOpacity.value = 0.3
      pingScale.value = withRepeat(withTiming(2, { duration: 1500 }), -1, false)
      pingOpacity.value = withRepeat(
        withTiming(0, { duration: 1500 }),
        -1,
        false
      )
    } else {
      cancelAnimation(pingScale)
      cancelAnimation(pingOpacity)
      pingScale.value = 1
      pingOpacity.value = 0
    }
  }, [actuacion?.isLive, pingScale, pingOpacity])

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pingOpacity.value,
  }))

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const handleAddInterpretacion = () => {
    router.push({
      pathname: '/(modal)/create-interpretacion',
      params: { id: actuacion?.idActuacion },
    })
  }

  const header = () => (
    <Text
      style={{
        fontWeight: '600',
      }}>
      {actuacion?.concepto}
    </Text>
  )

  const headerRight = () => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: 'white', position: 'relative' }}
        onPress={() =>
          updateFieldInDocument('isLive', !actuacion?.isLive, id.toString())
        }>
        {actuacion?.isLive && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
              pingStyle,
            ]}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'red',
              }}
            />
          </Animated.View>
        )}
        <Ionicons
          name={actuacion?.isLive ? 'play' : 'play-outline'}
          color={actuacion?.isLive ? 'red' : 'black'}
          size={20}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Stack.Screen
        options={{ headerTitle: header, headerRight: headerRight }}
      />
      {actuacion && repertorio && !loadingRepertorio && !actuacionLoading ? (
        <>
          <StickyActuacionHeader
            actuacion={actuacion}
            repertorioCount={repertorio.length}
            scrollY={scrollY}
          />
          <Animated.FlatList
            data={repertorio}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ActivityIndicator />
              </View>
            }
            renderItem={({ item }) => (
              <InterpretacionItem
                item={item}
                onEdit={() =>
                  router.push(
                    `/(modal)/edit-interpretacion?actuacionId=${id}&interpretacionId=${item.idInterpretacion}`
                  )
                }
                onUbicacionTouch={() => {}}
              />
            )}
            style={{ backgroundColor: 'white' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyExtractor={item => item.idInterpretacion}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          />
          <View style={styles.bottomActionBar}>
            <View style={styles.secondaryButtons}>
              <Pressable style={styles.secondaryButton}>
                <Ionicons name="pencil-outline" size={20} color="#4b5563" />
              </Pressable>
              <Pressable style={styles.secondaryButton}>
                <Ionicons name="share-social-outline" size={20} color="#4b5563" />
              </Pressable>
            </View>
            <View style={styles.primaryButtonContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={handleAddInterpretacion}>
                <Ionicons name="musical-notes" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Añadir</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color="indigo" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: '#E5E7EB' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonContainer: {
    flex: 1,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
