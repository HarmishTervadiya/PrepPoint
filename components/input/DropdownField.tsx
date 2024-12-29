import React, {useState} from 'react';
import {View, StyleSheet, Image, KeyboardAvoidingView} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import DownArrow from '@/assets/images/icons/back-arrow.png';

type DropdownFieldProps = {
  options: {label: string; value: string}[];
  onSelect: (value: string) => void;
  placeholder: string;
  value: string;
};

const DropdownField = ({
  options,
  onSelect,
  placeholder,
  value,
}: DropdownFieldProps) => {
  const {customColors} = useTheme() as CustomTheme;
  const [isFocus, setIsFocus] = useState(false);

  return (
    <KeyboardAvoidingView>
      <View
        style={[styles.container, {shadowColor: customColors.secondaryShadow}]}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={options}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            onSelect(item.value);
            setIsFocus(false);
          }}
          renderRightIcon={() => (
            <Image
              source={DownArrow}
              style={styles.rightIcon}
              resizeMode="contain"
              resizeMethod="auto"
            />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

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
  dropdown: {
    flex: 1,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
  rightIcon: {
    width: 18,
    height: 18,
    tintColor: '#a4a4a4',
    transform: [{rotate: '270deg'}],
  },
});

export default DropdownField;
