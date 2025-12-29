import { Actuacion } from '@/models/interfaces'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated'

interface StickyActuacionHeaderProps {
  actuacion: Actuacion
  repertorioCount: number
  scrollY: SharedValue<number>
}

export default function StickyActuacionHeader({
  actuacion,
  repertorioCount,
  scrollY,
}: StickyActuacionHeaderProps) {
  const date = new Date(actuacion.fecha.seconds * 1000)
    .toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  // TODO: Calcular estas estadísticas basándose en el repertorio real
  const totalDuration = '3h 15m' // Placeholder
  const marchesPerHour = '3.7' // Placeholder

  const headerStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)

    return {
      paddingVertical: interpolate(progress, [0, 1], [20, 8]),
      shadowOpacity: interpolate(progress, [0, 1], [0, 0.08]),
      shadowRadius: interpolate(progress, [0, 1], [0, 8]),
    }
  })

  const infoRowsStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)

    return {
      opacity: 1 - progress,
      maxHeight: interpolate(progress, [0, 1], [200, 0]),
      overflow: 'hidden',
    }
  })

  const statsStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)

    return {
      marginTop: interpolate(progress, [0, 1], [16, 8]),
      gap: interpolate(progress, [0, 1], [12, 6]),
    }
  })

  const sectionHeaderStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)

    return {
      opacity: 1 - progress,
      maxHeight: interpolate(progress, [0, 1], [50, 0]),
      overflow: 'hidden',
    }
  })

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      {/* Primera fila - Organizador (siempre visible) */}
      <View style={styles.infoRow}>
        <Ionicons name="people" size={18} color="#6b7280" style={styles.icon} />
        <Text style={styles.infoText}>
          <Text style={styles.infoTextBold}>{actuacion.organizador1}</Text>
        </Text>
      </View>

      {/* Filas adicionales - Se ocultan en modo compacto */}
      <Animated.View style={infoRowsStyle}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={18}
            color="#6b7280"
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {actuacion.ubicacion}, {actuacion.ciudad}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar"
            size={18}
            color="#6b7280"
            style={styles.icon}
          />
          <Text style={styles.infoText}>{date}</Text>
        </View>
      </Animated.View>

      {/* Estadísticas */}
      <Animated.View style={[styles.statsContainer, statsStyle]}>
        <StatItem
          value={repertorioCount.toString()}
          label="Composiciones"
          scrollY={scrollY}
        />
        <StatItem
          value={totalDuration}
          label="Duración"
          scrollY={scrollY}
        />
        <StatItem
          value={marchesPerHour}
          label="Marchas/h"
          scrollY={scrollY}
        />
      </Animated.View>

      {/* Section header - Se oculta en modo compacto */}
      <Animated.View style={[styles.sectionHeader, sectionHeaderStyle]}>
        <Text style={styles.sectionTitle}>REPERTORIO</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{repertorioCount}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

interface StatItemProps {
  value: string
  label: string
  scrollY: SharedValue<number>
}

function StatItem({ value, label, scrollY }: StatItemProps) {
  const statStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)

    return {
      padding: interpolate(progress, [0, 1], [12, 4]),
      gap: interpolate(progress, [0, 1], [4, 0]),
      borderRadius: interpolate(progress, [0, 1], [8, 6]),
    }
  })

  const numberStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)
    const fontSize = interpolate(progress, [0, 1], [20, 13])

    return {
      fontSize,
      lineHeight: fontSize * 1.2,
    }
  })

  const labelStyle = useAnimatedStyle(() => {
    const progress = Math.min(scrollY.value / 50, 1)
    const fontSize = interpolate(progress, [0, 1], [11, 7])

    return {
      fontSize,
      lineHeight: fontSize * 1.2,
      letterSpacing: interpolate(progress, [0, 1], [0.5, 0.2]),
    }
  })

  return (
    <Animated.View style={[styles.statItem, statStyle]}>
      <Animated.Text style={[styles.statNumber, numberStyle]}>
        {value}
      </Animated.Text>
      <Animated.Text style={[styles.statLabel, labelStyle]}>
        {label}
      </Animated.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  icon: {
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
    flex: 1,
  },
  infoTextBold: {
    color: '#1f2937',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    lineHeight: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
  },
})
