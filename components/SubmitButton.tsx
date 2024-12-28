import {ColorValue, DimensionValue, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, { PropsWithChildren } from 'react';

type SubmitButtonProps = PropsWithChildren<{
    text: string;
    width: DimensionValue;
    backgroundColor: ColorValue;
    textColor: ColorValue;
    fontSize?: number;
    onPress: () => void;
}>

const SubmitButton = ({text, textColor, fontSize=16, backgroundColor, width, onPress}: SubmitButtonProps) => {
  return (
    <TouchableOpacity style={[styles.loginButton, {width: width, backgroundColor: backgroundColor}]} onPress={onPress} activeOpacity={.9}>
      <Text style={[styles.loginButtonText, {color: textColor, fontSize: fontSize}]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 8,
    paddingVertical: 16,
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
