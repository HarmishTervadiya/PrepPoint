import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useRouter} from 'expo-router';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {getAuthData} from '@/utils/authStorage';
import {
  clearUserData,
  getUserDetails,
} from '@/redux-toolkit/features/auth/authSlice';
import QuestionCard from '@/components/cards/QuestionCard';
import {getTopQuestions} from '@/redux-toolkit/features/content/questionSlice';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {getAllInstitutes} from '@/redux-toolkit/features/content/instituteSlice';
import {getTopContributors} from '@/redux-toolkit/features/content/contributorSlice';

const Index = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {user, isLoggedIn} = useAppSelector(state => state.authReducer);
  const {questions} = useAppSelector(state => state.questionContentReducer);
  const {institutes} = useAppSelector(state => state.instituteReducer);
  const {contributors} = useAppSelector(state => state.contributorReducer);

  const [isReady, setIsReady] = useState(false); // Track readiness of layout/router
  const [authChecked, setAuthChecked] = useState(false);
  const {customColors} = useTheme() as CustomTheme;
  const [refreshLoading, setRefreshLoading] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        dispatch(getUserDetails(user.id)),
        dispatch(getTopQuestions()),
        dispatch(getAllInstitutes()),
        dispatch(getTopContributors()),
      ]);
    }, [dispatch]),
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(clearUserData());
            router.replace('/auth/userLogin');
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          // Optional: Handle when user dismisses the alert by tapping outside
        },
      }
    );
  };

  const navigateToQuestion = (questionId: string) => {
    router.push({
      pathname: '/detail/questionDetails',
      params: {questionId},
    });
  };

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    Promise.all([
      dispatch(getTopQuestions()),
      dispatch(getAllInstitutes()),
      dispatch(getTopContributors()),
    ]);
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={handleRefresh}
            colors={[customColors.primary]}
          />
        }>
        {/* Header */}
        <View style={defaultStyle.row}>
          <Text style={Typography.heading}>PrepPoint</Text>
          {user?.id ? (
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={28}
                color={customColors.primary}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.replace('/auth/userLogin')}>
              <Text style={Typography.body}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Welcome Section */}
        <Label
          value={`Hey, ${user?.name || ''}`}
          color={customColors.text}
          textStyle={styles.welcomeText}
        />
        <Label
          value="Ready to clear your exams"
          color={customColors.secondary}
          textStyle={styles.taglineText}
        />
        {questions.length > 0 &&
        institutes.length > 0 &&
        contributors.length > 0 ? (
          <>
            {/* Top Question Section */}
            <Label
              value="Here are some IMP's for you"
              color={customColors.text}
              textStyle={styles.sectionTitle}
            />
            <FlatList
              style={styles.questionsList}
              data={questions.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.questionCardWrapper}>
                  <QuestionCard
                    key={item.id}
                    username={item.owner.username || ''}
                    title={
                      item.title?.length > 30
                        ? `${item.title.substring(0, 60)}...`
                        : item.title || ''
                    }
                    subject={item.subject}
                    marks={item.marks}
                    attachments={item.attachments?.length || 0}
                    reads={item.reads}
                    date={item.date}
                    showFull={false}
                    profilePic={item.owner.profilePic.uri}
                    onPress={() => navigateToQuestion(item.id)}
                    id={item.id}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
            />

            {/* Institutes Section */}
            <View style={[defaultStyle.row, styles.sectionHeader]}>
              <Label
                value="Explore Institutes"
                color={customColors.text}
                textStyle={Typography.label}
              />
              <TouchableOpacity
                onPress={() => router.push('/detail/instituteList')}>
                <Label
                  value="View All"
                  color={customColors.primary}
                  textStyle={Typography.cardDetails}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={institutes.slice(0, 6)}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.instituteRow}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.instituteCard}
                  activeOpacity={0.9}>
                  <Image
                    source={{uri: item.instituteLogo.uri}}
                    style={styles.instituteIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
            />

            {/* Contributors Section */}
            <Label
              value="Top Contributors"
              color={customColors.text}
              textStyle={Typography.label}
            />
            <FlatList
              data={contributors}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.contributorItem}
                  activeOpacity={0.9}>
                  <Image
                    source={{uri: item.owner.profilePic.uri}}
                    style={styles.contributorAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.contributorInfo}>
                    <Text
                      style={[
                        styles.contributorName,
                        {color: customColors.text},
                      ]}>
                      {item.owner.username}
                    </Text>
                    <Text
                      style={[
                        styles.contributorReads,
                        {color: customColors.secondaryText},
                      ]}>
                      Reads: {item.totalReads}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.owner._id}
            />
          </>
        ) : (
          <ActivityIndicator
            size={'large'}
            color={customColors.primary}
            style={{flex: 1}}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  taglineText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  questionsList: {
    maxHeight: 180,
  },
  questionCardWrapper: {
    width: 280,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
  },
  instituteRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  instituteCard: {
    width: 70,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instituteIcon: {
    width: 40,
    height: 40,
  },
  contributorsTitle: {
    marginTop: 20,
    marginBottom: 15,
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
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  contributorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contributorReads: {
    fontSize: 14,
  },
});

export default Index;