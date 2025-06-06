import {StyleSheet, TextStyle} from 'react-native';

export type TypographyType = {
  [key: string]: TextStyle;
};

export const Typography = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'semibold',
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputErr: {
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    fontSize: 14,
  },
  cardDetails: {
    fontSize: 12,
    fontWeight: '500'
  }
});
