import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';

// Components
import Label from '@/components/text/Label';
import TextInputField from '@/components/input/TextInputField';

// Styles and Assets
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {CustomTheme} from '@/types/customTheme';
import Profile from '@/assets/images/icon.png';
import SearchIcon from '@/assets/images/icons/search.png';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Ionicons} from '@expo/vector-icons';
import {
  deleteQuestionFromList,
  getUserProfileDetails,
  searchQuestion,
} from '@/redux-toolkit/features/userProfile/userProfileSlice';
import {Question} from '@/types/question';
import timeAgoFormatter from '@/utils/dateFormatter';
import {useFocusEffect, useRouter} from 'expo-router';
import {deleteQuestion} from '@/redux-toolkit/features/content/questionSlice';
import {getUserDetails} from '@/redux-toolkit/features/auth/authSlice';
import {getAuthData, saveAuthData} from '@/utils/authStorage';

const UserProfile = () => {
  // Add auth redirection for guest user
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {user, userQuestions, searchResults, loading, error} = useAppSelector(
    state => state.userProfileReducer,
  );

  const authUser = useAppSelector(state => state.authReducer);
  const {customColors} = useTheme() as CustomTheme;

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchUserQuestions = useCallback(async () => {
    dispatch(getUserProfileDetails(authUser.user.id));
    console.log('Fetching user questions...');
  }, [dispatch]);

  const refreshUserDetails = async () => {
    try {
      const auth = await getAuthData();
      if (auth?.userId) {
        const result = await dispatch(getUserDetails(auth.userId));
        dispatch(getUserProfileDetails(auth.userId));
      } else {
        router.push('/auth/userLogin');
      }
    } catch (error) {
      console.error('Auth fetch error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!authUser.user.id) {
        Alert.alert('Authentication', 'Please login to your account');
        router.push('/auth/userLogin');
      }

      dispatch(getUserProfileDetails(authUser.user.id))
    }, [authUser]),
  );

  useEffect(() => {
    fetchUserQuestions();
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    refreshUserDetails();
    fetchUserQuestions();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchValue(text);
    dispatch(searchQuestion(text));
  }, []);

  const handleQuestionPress = useCallback((questionId: string) => {
    router.push({
      pathname: '/detail/questionDetails',
      params: {questionId: questionId},
    });
  }, []);

  const handleEditQuestion = (questionId: string) => {
    router.push({
      pathname: '/edit/questionEditor',
      params: {questionId: questionId},
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const response = await dispatch(deleteQuestion(questionId));
    if (response.meta.requestStatus === 'fulfilled') {
      dispatch(deleteQuestionFromList(questionId));
    }
  };

  const renderQuestion = (question: Question) => (
    <TouchableOpacity
      key={question.id}
      activeOpacity={0.9}
      style={styles.questionContainer}
      onPress={() => handleQuestionPress(question.id)}>
      <View style={[defaultStyle.row, styles.questionHeader]}>
        <Text style={styles.subjectBox}>{question.subject}</Text>

        <Menu>
          <MenuTrigger
            customStyles={{
              triggerWrapper: styles.menuTrigger,
            }}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#555" />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: styles.menuOptions,
            }}>
            <MenuOption
              onSelect={() => {
                handleEditQuestion(question.id);
              }}
              customStyles={{
                optionWrapper: styles.menuOption,
              }}>
              <View style={styles.menuOptionContent}>
                <Ionicons name="pencil-outline" size={18} color="#555" />
                <Text style={styles.menuOptionText}>Edit</Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                handleDeleteQuestion(question.id);
              }}
              customStyles={{
                optionWrapper: styles.menuOption,
              }}>
              <View style={styles.menuOptionContent}>
                <Ionicons name="trash-outline" size={18} color="#FF4545" />
                <Text style={[styles.menuOptionText, {color: '#FF4545'}]}>
                  Delete
                </Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <Text
        style={[
          styles.cardTitle,
          Typography.title,
          {color: customColors.text},
        ]}>
        {question.title}
      </Text>

      <View style={styles.divider} />

      <View style={defaultStyle.row}>
        {/* <Text style={styles.fileBox}>PDF</Text> */}
        {question.attachments && question.attachments.length > 0 && (
          <Text style={styles.fileBox}>
            {question.attachments?.length} Files
          </Text>
        )}

        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {(question.reads || '0') + ' Reads'}
        </Text>

        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {timeAgoFormatter(question.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={refreshLoading}
              colors={[customColors.primary]}
            />
          }
          contentContainerStyle={[defaultStyle.container, styles.container]}>
          {/* Header */}
          <View style={styles.header}>
            <Label
              value="Profile"
              color={customColors.text}
              textStyle={styles.headerTitle}
            />
          </View>

          <View style={styles.contentContainer}>
            {user._id && (
              <View style={[defaultStyle.row, styles.profileSection]}>
                <View style={[defaultStyle.row, styles.profileInfo]}>
                  {user.profilePic && user.profilePic.uri ? (
                    <Image
                      source={{uri: user.profilePic.uri}}
                      style={styles.profilePic}
                    />
                  ) : (
                    <Image source={Profile} style={styles.profilePic} />
                  )}
                  <View>
                    <Text
                      style={[
                        styles.cardText,
                        Typography.body,
                        {color: customColors.text},
                      ]}>
                      {user.name}
                    </Text>
                    {user.username && (
                      <Text
                        style={[
                          styles.cardText,
                          Typography.cardDetails,
                          {color: customColors.secondaryText},
                        ]}>
                        {user.username || ''}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    router.push('/edit/profileEditor');
                  }}
                  style={styles.editProfile}>
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            )}

            {authUser.user.isVerified ? (
              userQuestions &&
              userQuestions.length > 0 && (
                <>
                  <Label
                    value="Posted Questions"
                    color={customColors.text}
                    textStyle={Typography.title}
                  />

                  <TextInputField
                    value={searchValue}
                    onChangeText={handleSearch}
                    placeholder="Search"
                    icon={SearchIcon}
                  />

                  {searchValue
                    ? searchResults.map(question => renderQuestion(question))
                    : userQuestions &&
                      userQuestions.length > 0 &&
                      userQuestions.map(question => renderQuestion(question))}
                </>
              )
            ) : (
              <View
                style={{
                  height: '50%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push('/auth/userVerification');
                  }}>
                  <Label
                    value={'Verify your account and become a contributor'}
                    color={''}
                    textStyle={{
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: customColors.secondary,
                      textDecorationLine: 'underline',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    margin: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
  },
  headerTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    marginVertical: 12,
  },
  profileInfo: {
    gap: 8,
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 1,
    resizeMode: 'contain',
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 14,
    gap: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  questionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBox: {
    backgroundColor: '#E3F0FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#1877F2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  fileBox: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    fontWeight: '500',
    fontSize: 13,
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
  },
  editProfile: {
    padding: 10,
    borderWidth: 0.8,
    borderColor: '#bababa',
    borderRadius: 6,
    elevation: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    backgroundColor: '#ffffff',
  },
  editProfileText: {
    fontWeight: '500',
    color: '#333',
  },
  menuTrigger: {
    padding: 4,
  },
  menuOptions: {
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: 6,
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
});
