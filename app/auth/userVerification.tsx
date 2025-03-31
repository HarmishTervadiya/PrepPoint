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
import UserIcon from '@/assets/images/icons/user-icon.png';
import EmailIcon from '@/assets/images/icons/email.png';
import PasswordIcon from '@/assets/images/icons/password.png';
import SubmitButton from '@/components/SubmitButton';
import {router} from 'expo-router';
import {Controller, useForm} from 'react-hook-form';
import {RegisterForm, VerificationForm} from '@/types/auth';
import DropdownField from '@/components/input/DropdownField';
import pickDocument from '@/utils/filePicker';
import {useAppDispatch} from '@/redux-toolkit/store';
import {signupUser} from '@/redux-toolkit/features/auth/authSlice';

const UserVerification = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const institutes = [
    {value: '1', label: 'RKU'},
    {value: '2', label: 'IIT'},
  ];

  const courses = [
    {value: '1', label: 'B.Tech'},
    {value: '2', label: 'Diploma'},
  ];

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<VerificationForm>({
    defaultValues: {
      institute: '',
      course: '',
      proof: {uri: '', type: ''},
    },
  });

  const onSubmit = (data: VerificationForm) => {
    console.log('data', data);

    // dispatch(signupUser(data));
    // TO DO: implement register logic here
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
            value={'Verification'}
            color={customColors.text}
            textStyle={Typography.heading}
          />

          <Label
            value={'Verify your account and become a contributor'}
            color={customColors.secondaryText}
            textStyle={Typography.body}
          />

          <View style={styles.form}>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Institute is required'},
              }}
              render={({field: {onChange, value}}) => (
                <DropdownField
                  options={institutes}
                  onSelect={onChange}
                  placeholder="Select Institute"
                  value={value}
                />
              )}
              name="institute"
            />

            {errors.institute && (
              <Text style={styles.err}>{errors.institute.message}</Text>
            )}

            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Course is required'},
              }}
              render={({field: {onChange, value}}) => (
                <DropdownField
                  options={courses}
                  onSelect={onChange}
                  placeholder="Select Course"
                  value={value}
                />
              )}
              name="course"
            />

            {errors.course && (
              <Text style={styles.err}>{errors.course.message}</Text>
            )}

            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'ID Proof is required'},
              }}
              render={({field: {onChange, value}}) => (
                <TouchableOpacity
                  style={[styles.filePickerButton]}
                  activeOpacity={0.8}
                  onPress={async () => {
                    try {
                      const file = await pickDocument({multiple: false});
                      if (file && file.length > 0) {
                        const fileData = {
                          uri: file[0].uri,
                          type: file[0].type,
                        };
                        onChange(fileData);
                      }
                    } catch (err) {
                      console.error('Error picking document:', err);
                    }
                  }}>
                  <Label
                    value={'ID Proof'}
                    color={customColors.secondaryText}
                    textStyle={Typography.input}
                  />
                </TouchableOpacity>
              )}
              name="proof"
            />

            {errors.proof ? (
              <Text style={styles.err}>{errors.proof.message}</Text>
            ) : (
              <Text
                style={[
                  styles.err,
                  Typography.body,
                  {color: customColors.secondaryText},
                ]}>
                Add your institute id as a proof
              </Text>
            )}

            <View style={{height: 10}} />

            <SubmitButton
              text={'VERIFY'}
              textColor={customColors.btnText}
              backgroundColor={customColors.button}
              onPress={handleSubmit(onSubmit)}
              width={'100%'}
            />
          </View>
        </View>

        {/* <TouchableOpacity
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
          </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserVerification;

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
