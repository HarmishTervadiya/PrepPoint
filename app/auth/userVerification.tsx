import {
  Alert,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import {defaultStyle} from '@/themes/defaultStyles';
import HeaderShape from '@/components/auth/HeaderShape';
import Label from '@/components/text/Label';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import {Typography} from '@/themes/typography';
import SubmitButton from '@/components/SubmitButton';
import {Controller, useForm} from 'react-hook-form';
import {VerificationForm} from '@/types/auth';
import DropdownField from '@/components/input/DropdownField';
import pickDocument from '@/utils/filePicker';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  addVerificationRequest,
  getInstituteCourses,
  getInstitutes,
} from '@/redux-toolkit/features/auth/authSlice';
import TextInputField from '@/components/input/TextInputField';
import UserIcon from '@/assets/images/icons/user-icon.png';
import {useRouter} from 'expo-router';

const UserVerification = () => {
  const {customColors} = useTheme() as CustomTheme;
  const {error} = useAppSelector(state => state.authReducer);
  const dispatch = useAppDispatch();
  const [institutes, setInstitutes] = useState<
    {value: string; label: string}[]
  >([]);
  const [courses, setCourses] = useState<{value: string; label: string}[]>([]);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const router = useRouter();
  
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


  const getInstituteCoursesData = async () => {
    try {
      const response = await dispatch(getInstitutes());
      if (response.meta.requestStatus === 'fulfilled') {
        const institutesList = response.payload.map((institute: any) => ({
          value: institute._id,
          label: institute.instituteName,
        }));
        setInstitutes(institutesList);
      } else {
        Alert.alert('Error', response.payload);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    getInstituteCoursesData();
  }, [dispatch]); 

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<VerificationForm>({
    defaultValues: {
      username: '',
      institute: '',
      course: '',
      proof: {uri: '', type: '', size: 0},
    },
  });

  // Watch for institute changes to update courses
  const selectedInstitute = watch('institute');

  useEffect(() => {
    setCourses([]);

    const fetchCourses = async () => {
      if (selectedInstitute && institutes.length > 0) {
        const institute = institutes.find(
          inst => inst.value === selectedInstitute,
        );
        if (institute) {
          const response = await dispatch(getInstituteCourses(institute.value));
          const coursesList = response.payload.map(({course}: any) => ({
            value: course._id,
            label: course.courseName,
          }));

          setCourses(coursesList);
        }
      }
    };

    fetchCourses();
  }, [selectedInstitute, institutes]);

  const onSubmit = async (data: VerificationForm) => {
    if (!data.proof || !data.proof.uri) {
      Alert.alert('Error', 'Please select a proof document');
      return;
    }

    try {
      const response = await dispatch(addVerificationRequest(data));

      if (response.meta.requestStatus === 'fulfilled') {
        Alert.alert(
          'Success',
          'Your verification request has been submitted successfully',
        );

        router.replace('/(main)');
      } else {
        Alert.alert(
          'Error',
          response.payload || 'Failed to submit verification request',
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  
  const onRefresh = useCallback(() => {
    setRefreshLoading(true);
    getInstituteCoursesData();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 2000); // Simulating a 2 second delay for the refresh
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[defaultStyle.container, {flexGrow: 1}]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={onRefresh} 
            colors={[customColors.primary]}
          />
        }>
        <View style={[defaultStyle.row]}>
          <BackButton />
          <HeaderShape />
        </View>

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <View style={[{gap: 5, flex: 1}, styles.form]}>
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
                  required: 'Username is required',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInputField
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Create Username"
                    icon={UserIcon}
                  />
                )}
                name="username"
              />
              {errors.username && (
                <Text style={styles.err}>{errors.username.message}</Text>
              )}

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
                render={({field: {onChange, value}}) => {
                  return (
                    <DropdownField
                      options={courses}
                      onSelect={selectedValue => {
                        onChange(selectedValue);
                      }}
                      placeholder="Select Course"
                      value={value}
                    />
                  );
                }}
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
                            size: file[0].size,
                          };
                          onChange(fileData);
                        }
                      } catch (err) {
                        console.error('Error picking document:', err);
                      }
                    }}>
                    <Label
                      value={value.uri ? 'File Selected' : 'ID Proof'}
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
        </KeyboardAvoidingView>
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
