import React from 'react';
import {Tabs} from 'expo-router';
import {Image, Platform} from 'react-native';

import HomeIcon from '@/assets/images/icons/navbar-icons/home.icon.png';
import FilledHomeIcon from '@/assets/images/icons/navbar-icons/home.filled.icon.png';
import SearchIcon from '@/assets/images/icons/navbar-icons/search.icon.png';
import AddIcon from '@/assets/images/icons/navbar-icons/add.icon.png';
import FilledAddIcon from '@/assets/images/icons/navbar-icons/add.filled.icon.png';
import DashboardIcon from '@/assets/images/icons/navbar-icons/dashboard.icon.png';
import FilledDashboardIcon from '@/assets/images/icons/navbar-icons/dashboard.filled.icon.png';
import ProfileIcon from '@/assets/images/icons/navbar-icons/profile.icon.png';
import FilledProfileIcon from '@/assets/images/icons/navbar-icons/profile.filled.icon.png';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        lazy: false,
        animation: Platform.OS === 'android' ? 'none' : 'shift',
        freezeOnBlur: false,
        tabBarStyle: {
          elevation: 1,
          shadowOffset: {height: 1, width: 1},
          shadowColor: '#ADADAD',
          borderTopWidth: 0.3,
          borderColor: '#ADADAD',
        },
      }}
      backBehavior="history">
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? FilledHomeIcon : HomeIcon}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMethod="auto"
              resizeMode="cover"
            />
          ),
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
          tabBarIcon: ({focused}) => (
            <Image
              source={SearchIcon}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#8572FF' : '#000',
              }}
            />
          ),
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
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? FilledAddIcon : AddIcon}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMethod="auto"
              resizeMode="cover"
            />
          ),
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
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? FilledDashboardIcon : DashboardIcon}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMethod="auto"
              resizeMode="cover"
            />
          ),
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
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? FilledProfileIcon : ProfileIcon}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMethod="auto"
              resizeMode="cover"
            />
          ),
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
