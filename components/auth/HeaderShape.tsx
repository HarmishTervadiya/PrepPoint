import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomTheme} from '@/types/customTheme';
import {useTheme} from '@react-navigation/native';

const HeaderShape = () => {
  const {customColors} = useTheme() as CustomTheme;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.shape,
          styles.shape1,
          {backgroundColor: customColors.primary},
        ]}
      />
      <View
        style={[
          styles.shape,
          styles.shape2,
          {backgroundColor: customColors.tertiary},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Ensures child elements are positioned correctly
    width: 200, // Set container width to match shapes
    height: 160 // Adjust container height to fit the shapes
  },
  shape: {
    position: 'absolute',
    height: 120,
    borderTopLeftRadius: 130,
    borderBottomLeftRadius: 60,
  },
  shape1: {
    width: 180,
    top: 0, // Aligns the first shape at the top
    left: 40, // Aligns the first shape on the left
  },
  shape2: {
    width: 140,
    top: 30, // Slightly lower to create the overlap
    left: 80, // Slightly to the right to create the offset
    zIndex: 1, // Pushes the second shape behind the first
  },
});

export default HeaderShape;
