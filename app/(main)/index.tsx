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
import {
  getAllQuestions,
  getTopQuestions,
} from '@/redux-toolkit/features/content/questionSlice';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {Question} from '@/types/question';

import InstituteIcon from '@/assets/images/icons/instituteDemoIcon.png';
import {getAllInstitutes} from '@/redux-toolkit/features/content/instituteSlice';
import {getTopContributors} from '@/redux-toolkit/features/content/contributorSlice';

const Index = () => {
  const router = useRouter();
  const segments = useSegments(); // Monitor current route segments
  const dispatch = useAppDispatch();
  const {user, isLoggedIn} = useAppSelector(state => state.authReducer);
  const {questions} = useAppSelector(state => state.questionContentReducer);
  const {institutes} = useAppSelector(state => state.instituteReducer);
  const {contributors} = useAppSelector(state => state.contributorReducer);

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
    dispatch(getTopQuestions());
    dispatch(getAllInstitutes());
    dispatch(getTopContributors());
  }, [dispatch]);

  // Return a loading indicator if root layout is not ready
  if (!isReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <View style={[defaultStyle.row]}>
          <Text style={[Typography.heading, {fontFamily: ''}]}>PrepPoint</Text>

          {(user && user.id) ? (
          <TouchableOpacity
            onPress={() => {
              dispatch(clearUserData());
              router.replace('/auth/userLogin')
            }}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={customColors.primary}
            />
          </TouchableOpacity>
          ) : (
            <TouchableOpacity
            onPress={() => {
              router.replace('/auth/userLogin')
            }}>
              <Text style={[Typography.body]}>Login</Text>
          </TouchableOpacity>
          )}
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
        {questions && questions.length > 0 && (
          <FlatList
            style={{maxHeight: 180}}
            data={questions.slice(0, 5)}
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
        )}

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
        {institutes && institutes.length > 0 && (
          <FlatList
            data={institutes.slice(0, 6)}
            numColumns={3}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.instituteRow}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.instituteCard}
                onPress={() => {
                  // Handle institute press
                }}>
                <View style={styles.instituteIconContainer}>
                  <Image
                    source={{uri: item.instituteLogo.uri}}
                    style={styles.instituteIcon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item._id}
          />
        )}

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
        {contributors && contributors.length > 0 && (
          <FlatList
            data={contributors}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.contributorItem}>
                <Image
                  source={{uri: item.owner.profilePic.uri}}
                  style={styles.contributorAvatar}
                  resizeMode="contain"
                />
                <View style={styles.contributorInfo}>
                  <Text style={styles.contributorName}>
                    {item.owner.username}
                  </Text>
                  <Text style={styles.contributorRole}>
                    Reads: {item.totalReads}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.owner._id}
          />
        )}
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
