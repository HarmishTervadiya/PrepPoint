import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import {defaultStyle} from '@/themes/defaultStyles';
import HeaderShape from '@/components/auth/HeaderShape';
import Label from '@/components/text/Label';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import {Typography} from '@/themes/typography';
import TextInputField from '@/components/input/TextInputField';
import EmailIcon from '@/assets/images/icons/email.png';
import PasswordIcon from '@/assets/images/icons/password.png';
import SubmitButton from '@/components/SubmitButton';
import { router } from 'expo-router';

const userLogin = () => {
  const {customColors} = useTheme() as CustomTheme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          defaultStyle.container,
          {justifyContent: 'space-between', height: '100%'},
        ]}>
        <View style={[defaultStyle.row]}>
          <BackButton />
          <HeaderShape />
        </View>

        <View style={{gap: 5}}>
          <Label
            value="Login"
            color={customColors.text}
            textStyle={Typography.heading}
          />

          <Label
            value="Please sign in to your account"
            color={customColors.secondaryText}
            textStyle={Typography.body}
          />

          <View style={styles.form}>
            <TextInputField
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              secureTextEntry={false}
              icon={EmailIcon}
            />
            <TextInputField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
              icon={PasswordIcon}
            />
            <TouchableOpacity style={styles.forgotPassword} activeOpacity={.6}>
              <Label
                value="Forgot Password?"
                color={customColors.secondaryText}
                textStyle={Typography.body}
              />
            </TouchableOpacity>
            <SubmitButton text='LOGIN' textColor={customColors.btnText} backgroundColor={customColors.button} onPress={()=> {}} width={'100%'}  />
          </View>
        </View>

        <TouchableOpacity style={styles.footer} activeOpacity={0.6}
          onPress={()=> router.push('/auth/userRegister')}
        >
          <Label
            value="Don't have an account?"
            color={customColors.secondaryText}
            textStyle={Typography.body}
          />
          <Label
            value="Sign Up"
            color={customColors.primaryText}
            textStyle={Typography.body}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default userLogin;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 2,
  },
  form: {
    width: '100%',
    marginTop: 40,
  },
  forgotPassword: {
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'flex-end',
  },
});
