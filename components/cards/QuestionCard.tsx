import {Image, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React from 'react';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Profile from '@/assets/images/icons/user-icon.png';
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

  // Make sure subject is actually a string to prevent type errors
  const subjectName =
    typeof subject === 'string' ? subject : subject || 'Unknown Subject';

  // Make sure reads is a number
  const readsCount = typeof reads === 'number' ? reads : 0;

  // Make sure attachments is a number
  const attachmentsCount = typeof attachments === 'number' ? attachments : 0;

  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}>
      <View style={[defaultStyle.row, {gap: 6}]}>
        <Text style={styles.subjectBox}>{subjectName}</Text>
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
          {marks} Mark
        </Text>
        <Text
          style={[
            styles.cardText,
            Typography.cardDetails,
            {color: customColors.secondaryText},
          ]}>
          {readsCount} Reads
        </Text>
      </View>

      {showFull && (
        <>
          <View style={styles.divider} />

          <View style={defaultStyle.row}>
            <View>
              {attachmentsCount > 0 && (
                <Text style={styles.fileBox}>
                  {attachmentsCount} {attachmentsCount === 1 ? 'File' : 'Files'}
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
    borderRadius: 8,
    padding: 15,
    margin: 12,
    gap: 10,
    // Platform-specific shadow handling
    ...Platform.select({
      ios: {
        shadowOffset: {
          height: 2,
          width: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: '#000',
      },
      android: {
        elevation: 3, // Reduced from 2 to 3 for better consistency
      },
    }),
    // Alternative: Use border instead of elevation/shadow
    // borderWidth: 1,
    // borderColor: '#E5E5E5',
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
    flexShrink: 1,
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
    marginVertical: 2,
  },
});