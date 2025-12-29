import React, { useEffect, useMemo, useRef } from 'react'
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  ViewStyle,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

type Size = 'sm' | 'md' | 'lg'

type CheckboxProps = {
  value: boolean
  onValueChange?: (next: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  invalid?: boolean // pinta borde rojo (error)
  indeterminate?: boolean // estado “-“ como shadcn
  size?: Size
  style?: ViewStyle
  labelStyle?: object
}

export function XCheckbox({
  value,
  onValueChange,
  label,
  description,
  disabled,
  invalid,
  indeterminate,
  size = 'md',
  style,
  labelStyle,
}: CheckboxProps) {
  // Animación de aparición del check/indeterminate
  const anim = useRef(
    new Animated.Value(value || indeterminate ? 1 : 0)
  ).current
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value || indeterminate ? 1 : 0,
      duration: 140,
      useNativeDriver: true,
    }).start()
  }, [value, indeterminate])

  const S = useMemo(() => sizeTokens(size), [size])

  // Colores base (inspirado en shadcn/slate)
  const palette = {
    border: invalid
      ? '#ef4444'
      : value || indeterminate
      ? '#111827'
      : '#e5e7eb',
    bg: value || indeterminate ? '#111827' : '#FFFFFF',
    bgDisabled: '#F3F4F6',
    text: '#111827',
    textMuted: '#6B7280',
  }

  const boxStyles: ViewStyle = {
    width: S.box,
    height: S.box,
    borderRadius: S.radius,
    borderWidth: 1.6,
    borderColor: palette.border,
    backgroundColor: disabled ? palette.bgDisabled : palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.6 : 1 },
        style,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      android_ripple={
        Platform.OS === 'android'
          ? { color: 'rgba(0,0,0,0.06)', borderless: false }
          : undefined
      }
      hitSlop={8}>
      <View style={boxStyles}>
        {/* Check o guion indeterminado con animación */}
        {indeterminate ? (
          <Animated.View
            style={{
              width: S.box * 0.55,
              height: 2,
              borderRadius: 2,
              backgroundColor: '#FFFFFF',
              transform: [{ scale: anim }],
            }}
          />
        ) : (
          <Animated.View style={{ transform: [{ scale: anim }] }}>
            {value ? (
              <Feather name="check" size={S.icon} color="#FFFFFF" />
            ) : null}
          </Animated.View>
        )}
      </View>

      {!!label && (
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            style={[
              { fontSize: S.font, color: palette.text, fontWeight: '500' },
              labelStyle,
            ]}>
            {label}
          </Text>
          {!!description && (
            <Text
              style={{
                marginTop: 2,
                fontSize: S.font - 2,
                color: palette.textMuted,
              }}>
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  )
}

function sizeTokens(size: Size) {
  switch (size) {
    case 'sm':
      return { box: 18, icon: 12, radius: 4, font: 14 }
    case 'lg':
      return { box: 24, icon: 16, radius: 6, font: 16 }
    case 'md':
    default:
      return { box: 20, icon: 14, radius: 5, font: 15 }
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
})

export default XCheckbox
