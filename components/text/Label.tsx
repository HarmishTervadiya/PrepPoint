import {StyleSheet, Text, TextStyle, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {Typography} from '@/themes/typography';

type LabelProps = PropsWithChildren<{
  value: string;
  color: string;
  textStyle: TextStyle;
}>;

const Label = ({value, color, textStyle}: LabelProps) => {
  return <Text style={[{color: color}, textStyle]}>{value}</Text>;
};

export default Label;

const styles = StyleSheet.create({});
