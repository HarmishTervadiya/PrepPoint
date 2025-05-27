import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {useRouter} from 'expo-router';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  updateUserProfile,
  updateUserProfilePicture,
} from '@/redux-toolkit/features/userProfile/userProfileSlice';

// Components
import BackButton from '@/components/BackButton';
import Label from '@/components/text/Label';
import SubmitButton from '@/components/SubmitButton';

// Styles
import {defaultStyle} from '@/themes/defaultStyles';
import {CustomTheme} from '@/types/customTheme';

// Default profile image
import ProfileIcon from '@/assets/images/icon.png';
import pickDocument from '@/utils/filePicker';

const ProfileEditForm = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {user} = useAppSelector(state => state.userProfileReducer);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: user.username || '',
      name: user.name || '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Dispatch update profile action
      const response = await dispatch(
        updateUserProfile({
          _id: user._id,
          name: data.name,
          username: data.username,
        }),
      );

      if (response.meta.requestStatus === 'fulfilled') {
        alert('Profile updated successfully');
        router.back();
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const changeProfile = async ({uri, type, size}: any) => {
    try {
      const response = await dispatch(
        updateUserProfilePicture({
          _id: user._id,
          uri,
          type,
          size,
        }),
      );

      if (response.meta.requestStatus === 'fulfilled') {
        alert('Profile updated successfully');
        router.back();
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          defaultStyle.container,
          styles.scrollContainer,
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <Label
            value="Edit Profile"
            color={customColors.text}
            textStyle={styles.headerTitle}
          />
        </View>

        {/* Profile Photo */}
        <TouchableOpacity
          onPress={async () => {
            try {
              const file = await pickDocument({multiple: false});
              if (file && file.length > 0) {
                const fileData = {
                  uri: file[0].uri,
                  type: file[0].type,
                  size: file[0].size,
                };

                changeProfile(fileData);
              }
            } catch (err) {
              console.error('Error picking document:', err);
            }
          }}
          style={styles.profilePhotoContainer}>
          <Image
            source={
              user.profilePic?.uri ? {uri: user.profilePic.uri} : ProfileIcon
            }
            style={styles.profilePhoto}
          />
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Username Field */}
          <Label
            value="Username"
            color={customColors.text}
            textStyle={styles.inputLabel}
          />
          <Controller
            control={control}
            rules={{required: 'Username is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Username"
                />
              </View>
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.error}>{errors.username.message}</Text>
          )}

          {/* Name */}
          <Label
            value="Name"
            color={customColors.text}
            textStyle={styles.inputLabel}
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Name is required',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Name"
                />
              </View>
            )}
            name="name"
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}

          {/* Gender and DOB Row */}
          {/* <View style={styles.rowContainer}>
            <View style={styles.halfColumn}>
              <Label value="Gender" color={customColors.text} textStyle={styles.inputLabel} />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Male"
                    />
                  </View>
                )}
                name="gender"
              />
            </View>
            
            <View style={styles.halfColumn}>
              <Label value="Date of Birth" color={customColors.text} textStyle={styles.inputLabel} />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="DD/MM/YYYY"
                    />
                  </View>
                )}
                name="dateOfBirth"
              />
            </View>
          </View> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push('/auth/changePassword');
            }}>
              
            <Label
              value={'Change Password'}
              color={customColors.primary}
              textStyle={{
                textAlign: 'right',
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </TouchableOpacity>

          {/* Submit Button */}
          <SubmitButton
            text="Update Details"
            textColor="#FFFFFF"
            backgroundColor="#7B68EE"
            onPress={handleSubmit(onSubmit)}
            width="100%"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
    marginBottom: 20,
  },
  headerTitle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F0FF',
  },
  form: {
    width: '100%',
    gap: 5,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 2,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfColumn: {
    width: '48%',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 2,
    marginTop: -12,
    marginBottom: 12,
  },
});
