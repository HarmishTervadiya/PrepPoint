import {
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import TextInputField from '@/components/input/TextInputField';
import Label from '@/components/text/Label';
import {
  getUserProfileDetails,
  searchQuestion,
} from '@/redux-toolkit/features/userProfile/userProfileSlice';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {CustomTheme} from '@/types/customTheme';
import {useTheme} from '@react-navigation/native';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';

import Profile from '@/assets/images/icon.png';
import SearchIcon from '@/assets/images/icons/search.png';
import FilterIcon from '@/assets/images/icons/filter-icon.png';

import QuestionCard from '@/components/cards/QuestionCard';
import {
  getTopQuestions,
  searchQuestions,
} from '@/redux-toolkit/features/content/questionSlice';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import {getAllInstitutes} from '@/redux-toolkit/features/content/instituteSlice';
import DropdownField from '@/components/input/DropdownField';
import {getAllSubjects} from '@/redux-toolkit/features/uploadQuestion/subjectSlice';
import SubmitButton from '@/components/SubmitButton';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form';

const search = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {SlideInMenu} = renderers;
  const {questions, loading, error} = useAppSelector(
    state => state.questionContentReducer,
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {instituteId: '', courseId: '', subjectId: ''},
  });

  const {institutes, institutesLoading, institutesError} = useAppSelector(
    state => state.instituteReducer,
  );
  const {subjects} = useAppSelector(state => state.subjectReducer);
  const {courses} = useAppSelector(state => state.courseReducer);
  const {customColors} = useTheme() as CustomTheme;

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    instituteId: '',
    courseId: '',
    subjectId: '',
  });

  const fetchTopQuestions = useCallback(async () => {
    dispatch(getTopQuestions());
    dispatch(getAllInstitutes());
    dispatch(getAllSubjects());
    console.log('Fetching questions...');
  }, [dispatch]);

  useEffect(() => {
    fetchTopQuestions();
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    fetchTopQuestions();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, [fetchTopQuestions]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchValue(text);
      dispatch(
        searchQuestions({
          searchQuery: text,
          filters: activeFilters,
        }),
      );
    },
    [activeFilters, dispatch],
  );

  const handleFilterChange = (data: any) => {
    // Update active filters for UI display
    const newFilters = {
      instituteId: data.instituteId || '',
      courseId: data.courseId || '',
      subjectId: data.subjectId || '',
    };
    
    setActiveFilters(newFilters);
    
    // Dispatch search with all filters
    dispatch(
      searchQuestions({
        searchQuery: searchValue,
        filters: newFilters,
      }),
    );
  };

  const clearFilters = () => {
    setActiveFilters({
      instituteId: '',
      courseId: '',
      subjectId: '',
    });
    
    reset({
      instituteId: '',
      courseId: '',
      subjectId: '',
    });
    
    // Re-fetch questions without filters
    dispatch(
      searchQuestions({
        searchQuery: searchValue,
        filters: {},
      }),
    );
  };

  const handleQuestionPress = useCallback((questionId: string) => {
    router.push({
      pathname: '/detail/questionDetails',
      params: {questionId: questionId},
    });
  }, [router]);

  // Find the names of selected filters for display
  const getFilterName = (type: string, id: string) => {
    if (!id) return '';
    
    switch(type) {
      case 'institute':
        return institutes.find(i => i._id === id)?.instituteName || 'Selected Institute';
      case 'course':
        return courses.find(c => c._id === id)?.courseName || 'Selected Course';
      case 'subject':
        return subjects.find(s => s._id === id)?.name || 'Selected Subject';
      default:
        return '';
    }
  };

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
          <View style={styles.contentContainer}>
            <View style={[defaultStyle.row, {gap: 5}]}>
              <View
                style={[
                  styles.filterButtonContainer,
                  {
                    borderColor: customColors.primary,
                    borderWidth: 0.1,
                    shadowColor: customColors.secondaryShadow,
                    width: '85%',
                  },
                ]}>
                <TextInput
                  placeholder={'Search'}
                  value={searchValue}
                  onChangeText={handleSearch}
                  style={[styles.input, {color: customColors.text || '#333'}]}
                  placeholderTextColor={'#999'}
                />

                <Image
                  source={SearchIcon}
                  style={[styles.icon, {tintColor: customColors.primary}]}
                  resizeMode="contain"
                />
              </View>

              <Menu
                renderer={SlideInMenu}
                style={[
                  styles.filterButtonContainer,
                  {
                    borderColor: customColors.primary,
                    shadowColor: customColors.secondaryShadow,
                    opacity: 1,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <MenuTrigger>
                  <Image source={FilterIcon} style={{height: 20, width: 20}} />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      padding: 10,
                      width: '100%',
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    },
                    optionWrapper: {
                      padding: 10,
                    },
                    optionText: {
                      fontSize: 14,
                      color: customColors.text,
                    },
                  }}>
                  <MenuOption>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>Filter Questions</Text>
                  </MenuOption>

                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <DropdownField
                        options={institutes.map(institute => ({
                          label: institute.instituteName,
                          value: institute._id,
                        }))}
                        placeholder={'Select Institute'}
                        value={value}
                        onSelect={selectedValue => {
                          onChange(selectedValue);
                        }}
                      />
                    )}
                    name={'instituteId'}
                  />

                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <DropdownField
                        options={courses.map(course => ({
                          label: course.courseName,
                          value: course._id,
                        }))}
                        placeholder={'Select Course'}
                        value={value}
                        onSelect={selectedValue => {
                          onChange(selectedValue);
                        }}
                      />
                    )}
                    name={'courseId'}
                  />

                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <DropdownField
                        options={subjects.map(subject => ({
                          label: subject.name,
                          value: subject._id,
                        }))}
                        placeholder={'Select Subject'}
                        value={value}
                        onSelect={selectedValue => {
                          onChange(selectedValue);
                        }}
                      />
                    )}
                    name={'subjectId'}
                  />
                  <MenuOption>
                    <SubmitButton
                      text={'Apply filters'}
                      width={200}
                      backgroundColor={customColors.button}
                      textColor={customColors.btnText}
                      onPress={handleSubmit(handleFilterChange)}
                    />
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>

            {/* Filter indicators if any filter is active */}
            {(activeFilters.instituteId || activeFilters.courseId || activeFilters.subjectId) && (
              <View style={styles.activeFilterIndicator}>
                <View style={{flex: 1}}>
                  {activeFilters.instituteId && (
                    <Text style={{color: customColors.primary}}>
                      Institute: {getFilterName('institute', activeFilters.instituteId)}
                    </Text>
                  )}
                  {activeFilters.courseId && (
                    <Text style={{color: customColors.primary}}>
                      Course: {getFilterName('course', activeFilters.courseId)}
                    </Text>
                  )}
                  {activeFilters.subjectId && (
                    <Text style={{color: customColors.primary}}>
                      Subject: {getFilterName('subject', activeFilters.subjectId)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={clearFilters}
                  style={styles.clearFilterButton}>
                  <Text style={{color: '#fff'}}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text>Loading questions...</Text>
              </View>
            ) : questions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text>No questions found.</Text>
              </View>
            ) : (
              questions.map(question => (
                <QuestionCard
                  key={question.id}
                  id={question.id}
                  username={question.owner.username}
                  profilePic={question.owner.profilePic.uri}
                  title={question.title}
                  subject={question.subject}
                  marks={question.marks}
                  reads={question.reads}
                  attachments={question.attachments?.length || 0}
                  date={question.date}
                  showFull={true}
                  onPress={() => handleQuestionPress(question.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default search;

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
    marginVertical: 10,
    // gap: 12,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  clearFilterButton: {
    backgroundColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
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
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
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
  filterButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 8,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 14,
    marginLeft: 8,
    padding: 0,
  },
  icon: {
    width: 18,
    height: 18,
  },
});