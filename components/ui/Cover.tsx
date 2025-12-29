import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  ReduceMotion,
  Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

const Cover = ({ uri }: { uri?: string }) => {
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (uri) {
      // Reinicia y anima cada vez que llega/cambia la URL
      opacity.value = 0
      opacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      })
    }
  }, [uri])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  if (!uri) return null

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'white']}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      />
    </Animated.View>
  )
}

export default Cover

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.4,
    height: '100%',
    zIndex: 1,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.4,
    height: '100%',
    zIndex: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
})

// Uso:
// <Cover uri={item.coverImage} />
