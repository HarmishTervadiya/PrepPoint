import {ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {DarkTheme} from '@/themes/darkTheme';
import {LightTheme} from '@/themes/lightTheme';
import {Provider} from 'react-redux';
import store, {useAppDispatch} from '../redux-toolkit/store';
import React from 'react';
import {MenuProvider} from 'react-native-popup-menu';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
        <MenuProvider>
          <Stack screenOptions={{animation: 'none'}}>
            <Stack.Screen
              name="auth/userVerification"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="auth/passwordForgot"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="auth/changePassword"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="auth/userLogin"
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="auth/userRegister"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="detail/exploreContent"
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="detail/fileViewer"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="detail/questionDetails"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="detail/instituteList"
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="edit/profileEditor"
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="edit/questionEditor"
              options={{headerShown: false}}
            />

            <Stack.Screen name="(main)" options={{headerShown: false}} />

            <Stack.Screen name="+not-found" />
          </Stack>
        </MenuProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
