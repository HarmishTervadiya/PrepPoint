import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/store';
import { authenticateUser } from '@/redux-toolkit/features/auth/authSlice';

// Components
import BackButton from '@/components/BackButton';
import HeaderShape from '@/components/auth/HeaderShape';
import Label from '@/components/text/Label';
import TextInputField from '@/components/input/TextInputField';
import SubmitButton from '@/components/SubmitButton';

// Assets
import EmailIcon from '@/assets/images/icons/email.png';
import PasswordIcon from '@/assets/images/icons/password.png';

// Styles
import { defaultStyle } from '@/themes/defaultStyles';
import { Typography } from '@/themes/typography';
import { CustomTheme } from '@/types/customTheme';
import { LoginForm } from '@/types/auth';

const UserLogin = () => {
  const { customColors } = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await dispatch(authenticateUser(data)).unwrap();

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Login successful');
        router.replace('/(main)'); 
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[defaultStyle.container, styles.scrollContainer]}>
        
        {/* Header */}
        <View style={defaultStyle.row}>
          <BackButton />
          <HeaderShape />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Label value="Login" color={customColors.text} textStyle={Typography.heading} />
          <Label
            value="Please sign in to your account"
            color={customColors.secondaryText}
            textStyle={Typography.body}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Za-z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Email"
                icon={EmailIcon}
              />
            )}
            name="email"
          />
          {errors.email && <Text style={styles.err}>{errors.email.message}</Text>}

          <Controller
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                secureTextEntry
                icon={PasswordIcon}
              />
            )}
            name="password"
          />
          {errors.password && <Text style={styles.err}>{errors.password.message}</Text>}

          {/* Forgot Password */}
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

          {/* Submit Button */}
          <SubmitButton
            text="LOGIN"
            textColor={customColors.btnText}
            backgroundColor={customColors.button}
            onPress={handleSubmit(onSubmit)}
            width="100%"
          />
        </View>

        {/* Footer: Signup Link */}
        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.6}
          onPress={() => router.push('/auth/userRegister')}>
          <Label value="Don't have an account?" color={customColors.secondaryText} textStyle={Typography.body} />
          <Label value="Sign Up" color={customColors.primaryText} textStyle={Typography.body} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserLogin;

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  titleContainer: {
    gap: 5,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 2,
  },
  err: {
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
    marginLeft: 10,
    marginBottom: 6,
  },
});
