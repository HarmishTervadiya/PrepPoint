import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter, useSegments} from 'expo-router';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {getAuthData} from '@/utils/authStorage';
import {getUserDetails} from '@/redux-toolkit/features/auth/authSlice';

const Index = () => {
  const router = useRouter();
  const segments = useSegments(); // Monitor current route segments
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.authReducer.user); // Simulate user state
  const [isReady, setIsReady] = useState(false); // Track readiness of layout/router
  const [authChecked, setAuthChecked] = useState(false);

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
            Alert.alert('Error', 'Something went wrong while fetching user details');
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
  }, [isReady, user, segments]);

  // Return a loading indicator if root layout is not ready
  if (!isReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>Welcome {user.id} to the Home Page</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
