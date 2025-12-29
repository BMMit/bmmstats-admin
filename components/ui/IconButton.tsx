import { IconButtonProps } from '@/models/types'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Pressable, StyleSheet } from 'react-native'

const IconButton = ({
  name,
  size,
  onPress,
  buttonStyle,
  shadow,
}: IconButtonProps) => {
  return (
    <Pressable onPress={onPress} style={buttonStyle} hitSlop={5}>
      <Ionicons name={name} size={size || 20} style={shadow && styles.shadow} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shadow: {
    textShadowColor: 'lightgray',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 1,
  },
})
export default IconButton
