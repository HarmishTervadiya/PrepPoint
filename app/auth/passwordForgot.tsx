import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
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

const PasswordForgot = () => {
  const {customColors} = useTheme() as CustomTheme;
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      otp: '', 
    },
  });

  const onSubmit = (data: any) => {
    if (!isOtpSent) {
      setIsOtpSent(true);
      return;
    }

    // Handle OTP submission
    console.log(data.otp);
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
            value={'Forgot Password'}
            color={customColors.text}
            textStyle={Typography.heading}
          />

          <Label
            value={'Enter your email or username'}
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

            {isOtpSent && (
              <>
                <Controller
                  control={control}
                  rules={{
                    required: {value: true, message: 'OTP is required'},
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInputField
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter OTP"
                      secureTextEntry={false}
                      icon={PasswordIcon}
                    />
                  )}
                  name="otp"
                />

                {errors.otp && (
                  <Text style={styles.err}>{errors.otp.message}</Text>
                )}
              </>
            )}

            <View style={{height: 10}} />

            <SubmitButton
              text={isOtpSent ? 'VERIFY OTP' : 'SEND OTP'}
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
    </SafeAreaView>
  );
};

export default PasswordForgot;

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
  err: {
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
    marginLeft: 10,
    marginBottom: 6,
  },
});
