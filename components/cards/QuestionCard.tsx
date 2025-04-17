import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {defaultStyle} from '@/themes/defaultStyles';
import Label from '../text/Label';
import {Typography} from '@/themes/typography';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import SubmitButton from '../SubmitButton';
import {Question} from '@/types/question';
import Profile from '@/assets/images/icons/user-icon.png';
import {nanoid} from '@reduxjs/toolkit';
import timeAgoFormatter from '@/utils/dateFormatter';

type QuestionCardProps = {
  id: string;
  username: string;
  profilePic: string;
  title: string;
  subject: string;
  marks: number;
  reads: number;
  attachments: number;
  date: string;
  showFull: boolean;
  onPress: () => void;
};

export default function QuestionCard({
  id,
  username,
  profilePic,
  title,
  subject,
  marks,
  reads,
  attachments,
  date,
  showFull,
  onPress,
}: QuestionCardProps) {
  const {customColors} = useTheme() as CustomTheme;
  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}>
      <View style={defaultStyle.row}>
        <Text style={styles.subjectBox}>{subject}</Text>
        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {timeAgoFormatter(date)}
        </Text>
      </View>
      <Text
        style={[
          styles.cardTitle,
          Typography.title,
          {color: customColors.text},
        ]}>
        {title}
      </Text>
      <View style={defaultStyle.row}>
        <View style={[defaultStyle.row, {gap: 8}]}>
          {profilePic ? (
            <Image source={{uri: profilePic}} style={styles.profilePic} />
          ) : (
            <Image source={Profile} style={styles.profilePic} />
          )}
          <Text
            style={[
              styles.cardText,
              Typography.cardDetails,
              {color: customColors.secondaryText},
            ]}>
            {username}
          </Text>
        </View>
        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {reads + ' Reads'}
        </Text>
      </View>

      {showFull && (
        <>
          <View style={styles.divider}></View>

          <View style={defaultStyle.row}>
            <View>
              {attachments && (
                <Text style={styles.fileBox}>
                  {attachments} {attachments === 1 ? 'File' : 'Files'}
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.detailButton,
                {
                  backgroundColor: customColors.button,
                },
              ]}
              onPress={onPress}>
              <Text style={{color: customColors.btnText}}>View Details</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 15,
    margin: 15,
    gap: 10,
    borderRadius: 8,
  },
  profilePic: {
    height: 30,
    width: 30,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  subjectBox: {
    backgroundColor: '#E3F0FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#1877F2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  fileBox: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    fontWeight: '500',
    fontSize: 13,
  },
  cardTitle: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 13,
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#e0e0e0',
    // marginHorizontal: 8,
    marginVertical: 2,
  },
});
