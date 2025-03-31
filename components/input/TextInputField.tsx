import {
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import React, { PropsWithChildren } from 'react';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '@/types/customTheme';

type TextInputFieldProps = PropsWithChildren<{
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
  placeholder: string;
  secureTextEntry?: boolean;
  icon: ImageSourcePropType;
}>;

const TextInputField = ({
  placeholder,
  value,
  icon,
  secureTextEntry = false,
  onChangeText,
  onBlur
}: TextInputFieldProps) => {
  const { customColors } = useTheme() as CustomTheme;
  return (
    <View style={[styles.container, { shadowColor: customColors.secondaryShadow }]}>
      <Image source={icon} style={styles.icon} resizeMode='contain'resizeMethod='auto' />
      <TextInput
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 8,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: .5,
    shadowRadius: 50,
    elevation: 2,
    borderColor: '#8572FF',
    borderWidth: .1
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 14,
    marginLeft: 8,
    padding: 0,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: '#a4a4a4',
  },
});

