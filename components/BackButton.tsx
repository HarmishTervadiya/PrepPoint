import {Alert, BackHandler, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import BackArrow from '@/assets/images/icons/back-arrow.png';
import { router } from 'expo-router';

const BackButton = () => {
  const {customColors} = useTheme() as CustomTheme;

  const navigateBack = () => {
    if(router.canGoBack()){
      router.back()
    }else{
      Alert.alert("Exit",'Are you sure you want to go back?', [
        {
          text: "cancel",
          style: 'cancel'
        },
        {
          text: "yes",
          onPress: () => BackHandler.exitApp(),
          style: 'default'
        },
      ])

    }
  }

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
