import {
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  View,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import PasswordIcon from '@/assets/images/icons/password.png'

type TextInputFieldProps = PropsWithChildren<{
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  icon: ImageSourcePropType;
  editable?: boolean;
  disabled?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  error?: boolean;
}>;

const TextInputField = ({
  placeholder,
  value,
  icon,
  secureTextEntry = false,
  editable = true,
  disabled = false,
  onChangeText,
  onBlur,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  maxLength,
  error = false,
}: TextInputFieldProps) => {
  const {customColors} = useTheme() as CustomTheme;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: error
            ? 'red'
            : isFocused
            ? customColors.primary
            : customColors.border || '#8572FF',
          borderWidth: error || isFocused ? 1 : 0.1,
          shadowColor: customColors.secondaryShadow,
          opacity: disabled ? 0.7 : 1,
        },
      ]}>
      <Image
        source={icon}
        style={[
          styles.icon,
          {
            tintColor: error
              ? 'red'
              : isFocused
              ? customColors.primary
              : '#a4a4a4',
          },
        ]}
        resizeMode="contain"
        resizeMethod="auto"
      />

      <TextInput
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry && !showPassword}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          {color: error ? 'red' : customColors.text || '#333'},
        ]}
        placeholderTextColor={error ? 'rgba(255,0,0,0.5)' : '#999'}
        editable={editable && !disabled}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />

      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          disabled={disabled || !editable}
          style={styles.eyeIcon}>
          <Image
            source={PasswordIcon}
            style={[styles.icon, {tintColor: '#a4a4a4'}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
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
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 14,
    marginLeft: 8,
    padding: 0,
  },
  icon: {
    width: 18,
    height: 18,
  },
  eyeIcon: {
    padding: 4,
  },
});
