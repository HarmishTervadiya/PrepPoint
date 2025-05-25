import React from 'react';
import {Tabs} from 'expo-router';
import {Platform} from 'react-native';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        lazy: false,
        animation: Platform.OS === 'android' ? 'none' : 'shift',
        freezeOnBlur: false,
      }}
      backBehavior="history"
      
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarShowLabel: false,
          // Remove animation for Android to prevent flash
          ...(Platform.OS === 'android' && {
            animation: 'none',
            animationEnabled: false,
          }),
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarShowLabel: false,
          ...(Platform.OS === 'android' && {
            animation: 'none',
            animationEnabled: false,
          }),
        }}
      />
      
      <Tabs.Screen
        name="addQuestion"
        options={{
          title: 'Add Question',
          headerShown: false,
          tabBarShowLabel: false,
          ...(Platform.OS === 'android' && {
            animation: 'none',
            animationEnabled: false,
          }),
        }}
      />
      
      <Tabs.Screen
        name="userDashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarShowLabel: false,
          ...(Platform.OS === 'android' && {
            animation: 'none',
            animationEnabled: false,
          }),
        }}
      />
      
      <Tabs.Screen
        name="userProfile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarShowLabel: false,
          ...(Platform.OS === 'android' && {
            animation: 'none',
            animationEnabled: false,
          }),
        }}
      />
    </Tabs>
  );
};

export default _layout;