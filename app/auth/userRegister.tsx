import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import {defaultStyle} from '@/themes/defaultStyles';
import HeaderShape from '@/components/auth/HeaderShape';
import Label from '@/components/text/Label';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import {Typography} from '@/themes/typography';
import TextInputField from '@/components/input/TextInputField';
import UserIcon from '@/assets/images/icons/user-icon.png';
import EmailIcon from '@/assets/images/icons/email.png';
import PasswordIcon from '@/assets/images/icons/password.png';
import SubmitButton from '@/components/SubmitButton';
import {router} from 'expo-router';
import {Controller, useForm} from 'react-hook-form';
import {RegisterForm} from '@/types/auth';
import {useAppDispatch} from '@/redux-toolkit/store';
import {
  authenticateUser,
  signupUser,
} from '@/redux-toolkit/features/auth/authSlice';

const UserRegister = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    console.log('data', data);
    try {
      const result = await dispatch(signupUser(data)); 
  
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('User Registered Successfully:', result.payload);
        Alert.alert('Success', 'Registration successful!');
  
        // After successful signup, authenticate the user
        const loginResult = await dispatch(authenticateUser({ email: data.email, password: data.password }));
        if (loginResult.meta.requestStatus === 'fulfilled') {
          router.navigate('/(main)');
        }
      } else {
        Alert.alert('Error', result.payload || 'Registration failed');
      }
    } catch (err) {
      console.error('Error Registering:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  
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
            value={'Create your account'}
            color={customColors.text}
            textStyle={Typography.heading}
          />

          <Label
            value={'Fill the details and sign up to your account'}
            color={customColors.secondaryText}
            textStyle={Typography.body}
          />

          <View style={styles.form}>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Name is required'},
                minLength: {
                  value: 4,
                  message: 'Name must be greater than 4 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInputField
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Name"
                  secureTextEntry={false}
                  icon={UserIcon}
                />
              )}
              name={'name'}
            />

            {errors.name && (
              <Text style={styles.err}>{errors.name.message}</Text>
            )}

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
                  onBlur={onBlur}
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
                required: {value: true, message: 'Password is required'},
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
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
                  placeholder="Password"
                  onBlur={onBlur}
                  secureTextEntry={true}
                  icon={PasswordIcon}
                />
              )}
              name="password"
            />

            {errors.password && (
              <Text style={styles.err}>{errors.password.message}</Text>
            )}

            <View style={{height: 10}} />

            <SubmitButton
              text={'SIGN UP'}
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

export default UserRegister;

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
  filePickerButton: {
    width: 'auto',
    maxWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 8,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 2,
    borderColor: '#8572FF',
    borderWidth: 0.1,
    gap: 10,
  },
  filePickerText: {
    fontSize: 16,
    color: '#999',
  },
});
