import { Text, StyleSheet, TextStyle, TextProps } from 'react-native'
import { getFontSize } from '@/helpers/fonts'
import React from 'react'

type Variant = 'title' | 'subtitle' | 'body' | 'caption'
type Weight = 'light' | 'regular' | 'medium' | 'bold'

interface XTextProps extends TextProps {
  children: React.ReactNode
  variant?: Variant
  weight?: Weight
  align?: TextStyle['textAlign']
  color?: string
}

const fontSizeMap: Record<Variant, number> = {
  title: 16,
  subtitle: 12,
  body: 16,
  caption: 12,
}

const fontWeightMap: Record<Weight, TextStyle['fontWeight']> = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
}

const XText = ({
  children,
  variant = 'body',
  weight = 'regular',
  align = 'left',
  color = '#000',
  style,
  ...rest
}: XTextProps) => {
  const textStyle: TextStyle = {
    fontSize: getFontSize(fontSizeMap[variant]),
    fontWeight: fontWeightMap[weight],
    textAlign: align,
    color,
  }

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  )
}

export default XText
