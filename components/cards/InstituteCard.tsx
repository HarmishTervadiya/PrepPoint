import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';
import AppIcon from '@/assets/images/adaptive-icon.png';

const UniversityCard = ({name, logo, onClick}: any) => (
  <TouchableOpacity
    style={styles.universityCard}
    activeOpacity={0.8}
    onPress={onClick}
  >
      <Image
        source={{uri: logo}}
        style={styles.universityLogo}
        resizeMethod="auto"
        resizeMode="cover"
      />
    <Text style={styles.universityName}>{name}</Text>
  </TouchableOpacity>
);

export default UniversityCard;

const styles = StyleSheet.create({
  universityCard: {
    width: 155,
    height: 120,
    backgroundColor: '#fff',
    // flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  universityLogo: {
    width: 50,
    height: 50,
  },
  universityName: {
    width: '100%',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'baseline',
  },
});
