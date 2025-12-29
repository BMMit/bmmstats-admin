import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native'

type XButtonProps = {
  onPress: () => void
  label: string
  disabled?: boolean
  buttonStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const XButton = ({
  onPress,
  label,
  disabled,
  buttonStyle,
  textStyle,
}: XButtonProps) => {
  const animated = new Animated.Value(1)

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }
  return (
    <Pressable
      disabled={disabled}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      style={[styles.pressable, buttonStyle]}
      onPress={onPress}>
      <Text style={[styles.pressableText, textStyle]}>{label}</Text>
    </Pressable>
  )
}
export default XButton

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginTop: 'auto',
  },
  pressableText: {
    color: 'white',
    fontWeight: 600,
    textAlign: 'center',
    fontSize: 16,
  },
})
