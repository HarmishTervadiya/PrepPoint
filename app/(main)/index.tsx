import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter, useSegments} from 'expo-router';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {getAuthData} from '@/utils/authStorage';
import {
  clearUserData,
  getUserDetails,
} from '@/redux-toolkit/features/auth/authSlice';
import QuestionCard from '@/components/cards/QuestionCard';
import {getAllQuestions} from '@/redux-toolkit/features/content/questionSlice';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {Question} from '@/types/question';

import InstituteIcon from '@/assets/images/icons/instituteDemoIcon.png';

const Index = () => {
  const router = useRouter();
  const segments = useSegments(); // Monitor current route segments
  const dispatch = useAppDispatch();
  const {user, isLoggedIn} = useAppSelector(state => state.authReducer);
  // const {questions} = useAppSelector(state => state.questionContentReducer);
  const {questions} = useAppSelector(state => state.questionContentReducer);
  const [isReady, setIsReady] = useState(false); // Track readiness of layout/router
  const [authChecked, setAuthChecked] = useState(false);
  const {customColors} = useTheme() as CustomTheme;
  
  useEffect(() => {
    // Simulate a delay to ensure layout/rendering is complete (optional)
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const auth = await getAuthData();
        if (auth?.userId) {
          const result = await dispatch(getUserDetails(auth.userId));
          if (result.meta.requestStatus === 'rejected') {
            // Alert.alert(
            //   'Error',
            //   'Something went wrong while fetching user details',
            // );
          }
        }
      } catch (error) {
        console.error('Auth fetch error:', error);
      } finally {
        setAuthChecked(true); // Mark authentication check as done
      }
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    // if (isReady && authChecked && segments[0] !== 'auth') {
    // router.replace('/auth/userLogin');
    // }
    // if (isReady) router.replace('/detail/questionDetails');
  }, [isReady, user, segments]);

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [dispatch]);

  // Return a loading indicator if root layout is not ready
  if (!isReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const questionsDummy: Question[] = [
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
    {
      id: 'dfd',
      owner: {username: '', profilePic: {uri: 'cc'}},
      title: 'Hell',
      subject: 'dffd',
      marks: 5,
      attachments: null,
      content: '',
      reads: 0,
      date: '',
    },
  ];

  const instituteData = [
    {id: '1', name: 'Institute 1'},
    {id: '2', name: 'Institute 2'},
    {id: '3', name: 'Institute 3'},
    {id: '4', name: 'Institute 4'},
    {id: '5', name: 'Institute 5'},
    {id: '6', name: 'Institute 6'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <View style={[defaultStyle.row]}>
          <Text style={[Typography.heading, {fontFamily: ''}]}>PrepPoint</Text>

          <TouchableOpacity onPress={() => dispatch(clearUserData())}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={customColors.primary}
            />
          </TouchableOpacity>
        </View>

        <Label
          value={`Hey, ${user.name}`}
          color={customColors.text}
          textStyle={{fontSize: 16, fontWeight: 'bold', marginTop: 20}}
        />

        <Label
          value={'Ready to clear your exams'}
          color={customColors.secondary}
          textStyle={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}
        />

        <Label
          value={`Here are some IMP's for you`}
          color={customColors.text}
          textStyle={{fontSize: 16, fontWeight: 'semibold', marginBottom: 5}}
        />

        {/* Questions List */}
        <FlatList
          style={{maxHeight: 180}}
          data={questionsDummy}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={{width: 280}}>
              <QuestionCard
                key={item.id}
                username={item.owner.username || ''}
                title={item.title || ''}
                subject={item.subject}
                marks={item.marks}
                attachments={item.attachments?.length || 0}
                reads={item.reads}
                date={item.date}
                showFull={false}
                profilePic={item.owner.profilePic.uri}
                onPress={() =>
                  router.push({
                    pathname: '/detail/questionDetails',
                    params: {itemId: item.id},
                  })
                }
                id={item.id}
              />
            </View>
          )}
        />

        {/* Explore Institutes Section */}
        <View style={[defaultStyle.row, {marginTop: 20, marginBottom: 15}]}>
          <Label
            value={`Explore Institutes`}
            color={customColors.text}
            textStyle={Typography.label}
          />

          <TouchableOpacity>
            <Label
              value={`View All`}
              color={customColors.primary}
              textStyle={Typography.cardDetails}
            />
          </TouchableOpacity>
        </View>

        {/* Institute Grid */}
        <FlatList
          data={instituteData}
          numColumns={3}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.instituteRow}
          renderItem={({item, index}) => (
            <TouchableOpacity 
              style={styles.instituteCard}
              onPress={() => {
                // Handle institute press
              }}
            >
              <View style={styles.instituteIconContainer}>
                <Image
                  source={InstituteIcon}
                  style={styles.instituteIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Top Contributors Section */}
        <View style={[defaultStyle.row, {marginTop: 20, marginBottom: 15}]}>
          <Label
            value={`Top Contributors`}
            color={customColors.text}
            textStyle={Typography.label}
          />

          <TouchableOpacity>
            <Label
              value={`View All`}
              color={customColors.primary}
              textStyle={Typography.cardDetails}
            />
          </TouchableOpacity>
        </View>

        {/* Top Contributors List */}
        <FlatList
          data={[
            {id: '1', name: 'Heet@1234', role: 'Book Seller', avatar: 'H', color: '#20b2aa'},
            {id: '2', name: 'John@567', role: 'Teacher', avatar: 'J', color: '#ff6b6b'},
            {id: '3', name: 'Sarah@890', role: 'Student', avatar: 'S', color: '#4ecdc4'},
          ]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.contributorItem}>
              <View style={[styles.contributorAvatar, {backgroundColor: item.color}]}>
                <Text style={styles.contributorAvatarText}>{item.avatar}</Text>
              </View>
              <View style={styles.contributorInfo}>
                <Text style={styles.contributorName}>{item.name}</Text>
                <Text style={styles.contributorRole}>{item.role}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instituteRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  instituteCard: {
    width: 70,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instituteIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instituteIcon: {
    width: 40,
    height: 40,
  },
  adContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  adText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  contributorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  contributorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contributorAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  contributorRole: {
    fontSize: 14,
    color: '#666',
  },
});