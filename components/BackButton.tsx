import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import BackArrow from '@/assets/images/icons/back-arrow.png';
import {router, useRouter, useSegments} from 'expo-router';

const BackButton = () => {
  const {customColors} = useTheme() as CustomTheme;
  const segments = useSegments();

  const navigateBack = () => {
    const currentRoute = segments[segments.length - 1];
    if (currentRoute === 'userLogin') {
      router.replace('/(main)');
    } else if (currentRoute === 'userDashboard') {
      router.replace('/(main)');
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        Alert.alert('Exit', 'Are you sure you want to go back?', [
          {
            text: 'cancel',
            style: 'cancel',
          },
          {
            text: 'yes',
            onPress: () => BackHandler.exitApp(),
            style: 'default',
          },
        ]);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: customColors.backBtn}]}
      activeOpacity={0.7}
      onPress={navigateBack}>
      <Image
        source={BackArrow}
        resizeMethod="auto"
        resizeMode="cover"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  card: {
    padding: 6,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    shadowRadius: 1,
    elevation: 2,
  },
  icon: {
    height: 20,
    width: 20,
  },
});
