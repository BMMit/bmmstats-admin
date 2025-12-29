import ActuacionHeader from '@/components/ActuacionHeader'
import InterpretacionItem from '@/components/InterpretacionItem'
import IconButton from '@/components/ui/IconButton'
import useActuacion from '@/hooks/useActuacion'
import useRepertorio from '@/hooks/useRepertorio'
import { updateFieldInDocument } from '@/services/firebase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated'

export default function DetailScreenImproved() {
  const { id } = useLocalSearchParams()
  const { actuacion, actuacionLoading } = useActuacion(id.toString())
  const { repertorio, loadingRepertorio } = useRepertorio(id.toString())
  const [refreshing, setRefreshing] = useState(false)

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

  const onRefresh = async () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleAddInterpretacion = () => {
    router.push({
      pathname: '/(modal)/create-interpretacion',
      params: { id: actuacion?.idActuacion },
    })
  }

  const header = () => (
    <Text style={{ fontWeight: '600' }}>{actuacion?.concepto}</Text>
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

  const renderHeader = () => (
    <Animated.View entering={FadeIn.duration(400)} style={styles.headerInfo}>
      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color="#6b7280" />
        <Text style={styles.infoText}>{actuacion?.organizador1}</Text>
      </View>
      {actuacion?.organizador2 && (
        <View style={styles.infoRow}>
          <Ionicons name="people" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{actuacion?.organizador2}</Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text style={styles.infoText}>
          {actuacion?.ubicacion}, {actuacion?.ciudad}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
        <Text style={styles.infoText}>
          {new Date(actuacion?.fecha?.seconds * 1000).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{repertorio?.length || 0}</Text>
          <Text style={styles.statLabel}>Marchas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {repertorio?.filter(i => i.enlazada)?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Enlazadas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {repertorio?.filter(i => i.url)?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Externas</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Repertorio</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{repertorio?.length || 0}</Text>
        </View>
      </View>
    </Animated.View>
  )

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyState}>
      <Ionicons name="musical-notes-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No hay interpretaciones</Text>
      <Text style={styles.emptySubtitle}>
        Comienza añadiendo la primera marcha al repertorio
      </Text>
      <TouchableOpacity
        onPress={handleAddInterpretacion}
        style={styles.emptyButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Añadir primera marcha</Text>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <InterpretacionItem
        item={item}
        onEdit={() =>
          router.push(
            `/(modal)/edit-interpretacion?actuacionId=${id}&interpretacionId=${item.idInterpretacion}`
          )
        }
        onUbicacionTouch={(e) => console.log(e)}
      />
    </Animated.View>
  )

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: header, headerRight: headerRight }}
      />
      {actuacion?.concepto && !actuacionLoading ? (
        <>
          <FlatList
            data={repertorio}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyState}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyExtractor={item => item.idInterpretacion}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Floating Action Button */}
          <Animated.View entering={FadeIn.delay(300)} style={styles.fab}>
            <TouchableOpacity
              onPress={handleAddInterpretacion}
              style={styles.fabButton}
              activeOpacity={0.8}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Cargando actuación...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 8,
  },

  // Header Info
  headerInfo: {
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
