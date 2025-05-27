import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {router} from 'expo-router';
import {Controller, useForm} from 'react-hook-form';

// Components
import BackButton from '@/components/BackButton';
import HeaderShape from '@/components/auth/HeaderShape';
import Label from '@/components/text/Label';
import TextInputField from '@/components/input/TextInputField';
import SubmitButton from '@/components/SubmitButton';

// Redux
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  generateOtp,
  verifyOtp,
  resetPassword,
  resetForgotPasswordState,
} from '@/redux-toolkit/features/auth/authSlice';

// Assets & Styles
import EmailIcon from '@/assets/images/icons/email.png';
import PasswordIcon from '@/assets/images/icons/password.png';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {CustomTheme} from '@/types/customTheme';
import { ForgotPasswordFormData } from '@/types/auth';

const PasswordForgot = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [resendCooldown, setResendCooldown] = useState(0);
  const forgotPassword = useAppSelector(
    state => state.authReducer.forgotPassword,
  );
  const {loading, error, studentId, otpSent, otpVerified} = forgotPassword;
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    watch,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch values for password confirmation validation
  const watchNewPassword = watch('newPassword');

  // Handle OTP resend cooldown
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (resendCooldown > 0) {
      intervalId = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [resendCooldown]);

  // Navigate to different steps based on OTP verification state
  useEffect(() => {
    if (otpSent && step === 'email') {
      setStep('otp');
    }

    if (otpVerified && step === 'otp') {
      setStep('newPassword');
    }
  }, [otpSent, otpVerified, step]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Handle form submission based on current step
  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        if (step === 'email') {
          await dispatch(generateOtp(data.email)).unwrap();
          setResendCooldown(60); // Set 60 seconds cooldown for resend
        } else if (step === 'otp') {
          await dispatch(verifyOtp({studentId, otp: data.otp})).unwrap();
        } else if (step === 'newPassword') {
          if (data.newPassword !== data.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
          }

          await dispatch(
            resetPassword({
              studentId,
              newPassword: data.newPassword,
            }),
          ).unwrap();

          Alert.alert('Success', 'Password has been reset successfully', [
            {
              text: 'OK',
              onPress: () => {
                dispatch(resetForgotPasswordState());
                router.push('/auth/userLogin');
              },
            },
          ]);
        }
      } catch (err) {
        // Error is handled by Redux thunk and displayed via the useEffect above
      }
    },
    [step, studentId, dispatch],
  );

  const handleResendOTP = useCallback(async () => {
    if (resendCooldown > 0) return;

    try {
      const email = getValues('email');
      await dispatch(generateOtp(email)).unwrap();
      setResendCooldown(60);
      Alert.alert('Success', 'OTP has been resent');
    } catch (err) {
      // Error is handled by Redux
    }
  }, [resendCooldown, dispatch, getValues]);

  const handleChangeEmail = () => {
    dispatch(resetForgotPasswordState());
    setStep('email');
  };

  // Render form based on current step
  const renderForm = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <Label
              value={'Forgot Password'}
              color={customColors.text}
              textStyle={Typography.heading}
            />
            <Label
              value={'Enter your email to receive a verification code'}
              color={customColors.secondaryText}
              textStyle={Typography.body}
            />
            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'Email is required'},
                  pattern: {
                    value: /^[A-Za-z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'Invalid email format',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Email"
                    secureTextEntry={false}
                    icon={EmailIcon}
                    editable={!loading}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.err}>{errors.email.message}</Text>
              )}
              <View style={{height: 20}} />
              <SubmitButton
                text="SEND OTP"
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
          </>
        );

      case 'otp':
        return (
          <>
            <Label
              value={'Verify OTP'}
              color={customColors.text}
              textStyle={Typography.heading}
            />
            <Label
              value={'Enter the verification code sent to your email'}
              color={customColors.secondaryText}
              textStyle={Typography.body}
            />
            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'OTP is required'},
                  minLength: {
                    value: 4,
                    message: 'OTP must be at least 4 digits',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter OTP"
                    secureTextEntry={false}
                    icon={PasswordIcon}
                    editable={!loading}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                )}
                name="otp"
              />
              {errors.otp && (
                <Text style={styles.err}>{errors.otp.message}</Text>
              )}

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={styles.resendContainer}
                  onPress={handleChangeEmail}>
                  <Text
                    style={[
                      styles.resendText,
                      {
                        color: customColors.primary,
                      },
                    ]}>
                    Change email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendContainer}
                  onPress={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}>
                  <Text
                    style={[
                      styles.resendText,
                      {
                        color:
                          resendCooldown > 0
                            ? customColors.secondaryText
                            : customColors.primary,
                      },
                    ]}>
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{height: 20}} />
              <SubmitButton
                text="VERIFY OTP"
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
          </>
        );

      case 'newPassword':
        return (
          <>
            <Label
              value={'Reset Password'}
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
                  required: {value: true, message: 'New password is required'},
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Password must contain uppercase, lowercase, number, and special character',
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
                text="RESET PASSWORD"
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
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[defaultStyle.container]}>
          <View style={[defaultStyle.row]}>
            <BackButton />
            <HeaderShape />
          </View>

          <View style={styles.contentContainer}>{renderForm()}</View>

          <TouchableOpacity
            style={styles.footer}
            activeOpacity={0.6}
            onPress={() => router.push('/auth/userLogin')}>
            <Label
              value="Already have an account?"
              color={customColors.secondaryText}
              textStyle={Typography.body}
            />
            <Label
              value="Login"
              color={customColors.primaryText}
              textStyle={Typography.body}
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordForgot;

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
