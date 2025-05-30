import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import HeaderShape from '@/components/auth/HeaderShape';
import BackButton from '@/components/BackButton';
import Label from '@/components/text/Label';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import TextInputField from '@/components/input/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  changePassword,
} from '@/redux-toolkit/features/auth/authSlice';
import PasswordIcon from '@/assets/images/icons/password.png';
import { useRouter } from 'expo-router';

const ChangePassword = () => {
  const {customColors} = useTheme() as CustomTheme;
  const {loading, error} = useAppSelector(state => state.authReducer);
  const router = useRouter()
  const {
    control,
    formState: {errors},
    handleSubmit,
    watch,
  } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        router.replace('/(main)');
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  
  const dispatch = useAppDispatch();
  const watchNewPassword = watch('newPassword');

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const onSubmit = async (data: any) => {
    if (data.newPassword != data.confirmPassword) {
      return;
    }

    await dispatch(changePassword(data)).unwrap();

    Alert.alert('Success', 'Password changed successfully')
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            defaultStyle.container,
          ]}>
          <View style={[defaultStyle.row]}>
            <BackButton />
            <HeaderShape />
          </View>

          <View style={{flex: 1, marginTop: 40}}>
            <Label
              value={'Change Password'}
              color={customColors.text}
              textStyle={Typography.heading}
            />
            <Label
              value={'Create a new password for your account'}
              color={customColors.secondaryText}
              textStyle={Typography.body}
            />

            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'Old password is required'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Old Password"
                    secureTextEntry={true}
                    icon={PasswordIcon}
                    editable={!loading}
                    disabled={undefined}
                  />
                )}
                name="oldPassword"
              />
              {errors.oldPassword && (
                <Text style={styles.err}>{errors.oldPassword.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'New password is required'},
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Password must contain uppercase, lowercase, number, and special character, Whitespace is not allowed',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="New Password"
                    secureTextEntry={true}
                    icon={PasswordIcon}
                    editable={!loading}
                    disabled={undefined}
                  />
                )}
                name="newPassword"
              />
              {errors.newPassword && (
                <Text style={styles.err}>{errors.newPassword.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Confirm password is required',
                  },
                  validate: value =>
                    value === watchNewPassword || 'Passwords do not match',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    icon={PasswordIcon}
                    editable={!loading}
                    disabled={undefined}
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <Text style={styles.err}>{errors.confirmPassword.message}</Text>
              )}

              <View style={{height: 20}} />
              <SubmitButton
                text="CHANGE PASSWORD"
                textColor={customColors.btnText}
                backgroundColor={customColors.button}
                onPress={handleSubmit(onSubmit)}
                width={'100%'}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator
                  style={styles.loader}
                  color={customColors.primary}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    gap: 5,
    paddingVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 2,
  },
  form: {
    width: '100%',
    marginTop: 30,
  },
  err: {
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
    marginLeft: 10,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  resendContainer: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
