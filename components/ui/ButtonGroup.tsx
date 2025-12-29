import React, { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type ButtonGroupProps = {
  buttons: string[]
}

const PADDING = 3

const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  const [selected, setSelected] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const selectedSV = useSharedValue(0)

  const usableWidth = Math.max(0, containerWidth - PADDING * 2)
  const segmentWidth = buttons.length ? usableWidth / buttons.length : 0

  const thumbStyle = useAnimatedStyle(() => {
    const x = PADDING + segmentWidth * selectedSV.value
    return {
      transform: [{ translateX: withTiming(x, { duration: 220 }) }],
      width: segmentWidth,
    }
  }, [segmentWidth])

  const handlePress = (index: number) => {
    setSelected(index)
    selectedSV.value = index
  }

  return (
    <View
      style={styles.container}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      <Animated.View pointerEvents="none" style={[styles.thumb, thumbStyle]} />
      {buttons.map((label, i) => (
        <Pressable
          key={i}
          onPress={() => handlePress(i)}
          style={styles.segment}>
          <Text style={[styles.text, selected === i && styles.textSelected]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

export default ButtonGroup

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#7676801A',
    padding: PADDING,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    borderRadius: 6,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0,
  },
  text: { fontSize: 16, fontWeight: '500', color: '#3C3C4399' },
  textSelected: { color: '#000' },
})
