import {
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
import React, {useCallback, useState} from 'react';
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

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.authReducer);
  const {customColors} = useTheme() as CustomTheme;

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchUserQuestions = useCallback(() => {
    // Implement your fetch logic here
    console.log('Fetching user questions...');
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    fetchUserQuestions();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, [fetchUserQuestions]);

  const handleSearch = useCallback((text: string) => {
    setSearchValue(text);
    // Implement search functionality here
  }, []);

  const handleQuestionPress = useCallback((questionId: string) => {
    // Navigate to question details or implement your logic
    console.log('Question pressed:', questionId);
  }, []);

  const handleEditQuestion = useCallback(() => {
    console.log('Edit question');
  }, []);

  const handleDeleteQuestion = useCallback(() => {
    console.log('Delete question');
  }, []);

  const renderQuestion = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.questionContainer}
      onPress={() => handleQuestionPress('sample-id')}>
      <View style={[defaultStyle.row, styles.questionHeader]}>
        <Text style={styles.subjectBox}>{'Harmis'}</Text>
        
        <Menu>
          <MenuTrigger customStyles={{
            triggerWrapper: styles.menuTrigger
          }}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#555" />
          </MenuTrigger>
          <MenuOptions customStyles={{
            optionsContainer: styles.menuOptions
          }}>
            <MenuOption onSelect={handleEditQuestion} customStyles={{
              optionWrapper: styles.menuOption
            }}>
              <View style={styles.menuOptionContent}>
                <Ionicons name="pencil-outline" size={18} color="#555" />
                <Text style={styles.menuOptionText}>Edit</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={handleDeleteQuestion} customStyles={{
              optionWrapper: styles.menuOption
            }}>
              <View style={styles.menuOptionContent}>
                <Ionicons name="trash-outline" size={18} color="#FF4545" />
                <Text style={[styles.menuOptionText, {color: '#FF4545'}]}>Delete</Text>
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
        {'PSEE Exam Questions'}
      </Text>

      <View style={styles.divider} />

      <View style={defaultStyle.row}>
        <Text style={styles.fileBox}>PDF</Text>
        <Text style={styles.fileBox}>2 Files</Text>

        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {'0 Reads'}
        </Text>

        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {'7 days ago'}
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
            <View style={[defaultStyle.row, styles.profileSection]}>
              <View style={[defaultStyle.row, styles.profileInfo]}>
                <Image source={Profile} style={styles.profilePic} />
                <View>
                  <Text
                    style={[
                      styles.cardText,
                      Typography.body,
                      {color: customColors.text},
                    ]}>
                    {'Harmis Tervadiya'}
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      Typography.cardDetails,
                      {color: customColors.secondaryText},
                    ]}>
                    {'Harmis'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editProfile}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

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

            {renderQuestion()}
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