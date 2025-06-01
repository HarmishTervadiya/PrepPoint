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
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {defaultStyle} from '@/themes/defaultStyles';
import {CustomTheme} from '@/types/customTheme';
import {useTheme, useFocusEffect} from '@react-navigation/native';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';

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
import {Controller, useForm} from 'react-hook-form';
import {getAllCourses} from '@/redux-toolkit/features/content/courseSlice';
import Label from '@/components/text/Label';

const search = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {SlideInMenu} = renderers;
  const {questions, loading, error} = useAppSelector(
    state => state.questionContentReducer,
  );

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {instituteId: '', courseId: '', subjectId: ''},
  });

  const {institutes} = useAppSelector(state => state.instituteReducer);
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

  const menuRef = useRef(null);

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const fetchInitialData = useCallback(async () => {
    if (!initialDataLoaded) {
      await Promise.all([
        dispatch(getTopQuestions()),
        dispatch(getAllInstitutes()),
        dispatch(getAllSubjects()),
        dispatch(getAllCourses()),
      ]);
      setInitialDataLoaded(true);
    }
  }, [dispatch, initialDataLoaded]);

  const resetComponentState = useCallback(() => {
    setSearchValue('');
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
  }, [reset]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
      return () => {
        resetComponentState();
      };
    }, [fetchInitialData, resetComponentState]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    Promise.all([
      dispatch(getTopQuestions()),
      dispatch(getAllInstitutes()),
      dispatch(getAllSubjects()),
      dispatch(getAllCourses()),
    ]).finally(() => {
      setTimeout(() => {
        setRefreshLoading(false);
      }, 1000);
    });
  }, [dispatch]);

  // Debounced search function to prevent excessive API calls
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = useCallback(
    (text: string) => {
      setSearchValue(text);

      // Clear existing timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Set new timeout for debounced search
      searchTimeout.current = setTimeout(() => {
        dispatch(
          searchQuestions({
            searchQuery: text,
            filters: activeFilters,
          }),
        );
      }, 300); // 300ms debounce
    },
    [activeFilters, dispatch],
  );

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleFilterChange = useCallback(
    (data: any) => {
      const newFilters = {
        instituteId: data.instituteId || '',
        courseId: data.courseId || '',
        subjectId: data.subjectId || '',
      };

      setActiveFilters(newFilters);

      dispatch(
        searchQuestions({
          searchQuery: searchValue,
          filters: newFilters,
        }),
      );
    },
    [searchValue, dispatch],
  );

  const clearFilters = useCallback(() => {
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

    dispatch(
      searchQuestions({
        searchQuery: searchValue,
        filters: {},
      }),
    );
  }, [searchValue, dispatch, reset]);

  const handleQuestionPress = useCallback(
    (questionId: string) => {
      router.push({
        pathname: '/detail/questionDetails',
        params: {questionId: questionId},
      });
    },
    [router],
  );

  const getFilterName = useCallback(
    (type: string, id: string) => {
      if (!id) return '';

      switch (type) {
        case 'institute':
          return (
            institutes.find(i => i._id === id)?.instituteName ||
            'Selected Institute'
          );
        case 'course':
          return (
            courses.find(c => c._id === id)?.courseName || 'Selected Course'
          );
        case 'subject':
          return subjects.find(s => s._id === id)?.name || 'Selected Subject';
        default:
          return '';
      }
    },
    [institutes, courses, subjects],
  );

  // Memoized filter options to prevent unnecessary re-renders
  const instituteOptions = React.useMemo(
    () =>
      institutes.map(institute => ({
        label: institute.instituteName,
        value: institute._id,
      })),
    [institutes],
  );

  const courseOptions = React.useMemo(
    () =>
      courses.map(course => ({
        label: course.courseName,
        value: course._id,
      })),
    [courses],
  );

  const subjectOptions = React.useMemo(
    () =>
      subjects.map(subject => ({
        label: subject.name,
        value: subject._id,
      })),
    [subjects],
  );

  // Check if any filters are active
  const hasActiveFilters =
    activeFilters.instituteId ||
    activeFilters.courseId ||
    activeFilters.subjectId;

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
          contentContainerStyle={[styles.container]}>
          <View style={styles.header}>
            <Label
              value="Search"
              color={customColors.text}
              textStyle={styles.headerTitle}
            />
          </View>

          <View style={styles.contentContainer}>
            <View style={[defaultStyle.row, {paddingHorizontal: 8, gap: 5}]}>
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
                ref={menuRef}
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
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>
                      Filter Questions
                    </Text>
                  </MenuOption>

                  <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <DropdownField
                        options={instituteOptions}
                        placeholder={'Select Institute'}
                        value={value}
                        onSelect={onChange}
                      />
                    )}
                    name={'instituteId'}
                  />

                  <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <DropdownField
                        options={courseOptions}
                        placeholder={'Select Course'}
                        value={value}
                        onSelect={onChange}
                      />
                    )}
                    name={'courseId'}
                  />

                  <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <DropdownField
                        options={subjectOptions}
                        placeholder={'Select Subject'}
                        value={value}
                        onSelect={onChange}
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
            {hasActiveFilters && (
              <View style={styles.activeFilterIndicator}>
                <View style={{flex: 1}}>
                  {activeFilters.instituteId && (
                    <Text style={{color: customColors.primary}}>
                      Institute:{' '}
                      {getFilterName('institute', activeFilters.instituteId)}
                    </Text>
                  )}
                  {activeFilters.courseId && (
                    <Text style={{color: customColors.primary}}>
                      Course: {getFilterName('course', activeFilters.courseId)}
                    </Text>
                  )}
                  {activeFilters.subjectId && (
                    <Text style={{color: customColors.primary}}>
                      Subject:{' '}
                      {getFilterName('subject', activeFilters.subjectId)}
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
                <Text>No results found.</Text>
                <Text style={styles.emptySubText}>
                  Try adjusting your search or filters.
                </Text>
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
    marginTop: 40,
  },
  emptySubText: {
    marginTop: 8,
    color: '#777',
    textAlign: 'center',
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
