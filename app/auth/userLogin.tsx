import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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
import {router} from 'expo-router';
import {Controller, useForm} from 'react-hook-form';
import {LoginForm} from '@/types/auth';
import {useDispatch} from 'react-redux';
import {authenticateUser} from '@/redux-toolkit/features/auth/authSlice';
import {AppDispatch} from '@/redux-toolkit/store';
 
const UserLogin = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    dispatch(authenticateUser(data))
  };

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
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Email is required'},
                pattern: {
                  value: /^[A-Za-z0-9_.+-]+@[a-zA-Z0-9-]+.+[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInputField
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email"
                  secureTextEntry={false}
                  icon={EmailIcon}
                />
              )}
              name={'email'}
            />

            {errors.email && (
              <Text style={styles.err}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Password is required'}
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInputField
                  value={value}
                  onChangeText={onChange}
                  placeholder="Password"
                  // secureTextEntry={true}
                  icon={PasswordIcon}
                />
              )}
              name="password"
              defaultValue={''}
            />

            {errors.password && (
              <Text style={styles.err}>{errors.password.message}</Text>
            )}

            <TouchableOpacity
              style={styles.forgotPassword}
              activeOpacity={0.6}
              onPress={() => router.push('/auth/passwordForgot')}>
              <Label
                value="Forgot Password?"
                color={customColors.secondaryText}
                textStyle={Typography.body}
              />
            </TouchableOpacity>
            <SubmitButton
              text="LOGIN"
              textColor={customColors.btnText}
              backgroundColor={customColors.button}
              onPress={handleSubmit(onSubmit)}
              width={'100%'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.6}
          onPress={() => router.push('/auth/userRegister')}>
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

export default UserLogin;

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
  err: {
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
    marginLeft: 10,
    marginBottom: 6,
  },
});
