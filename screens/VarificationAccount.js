import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from '../assets/config/axios';
import { Modal, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import { AppStyles } from '../Appstyles';

export default function ScanQR() {
 
  return (
    <View style={styles.container}>
     <Text>
      Settings
     </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  viewAnimated: {
    width: '100%',
  },
  saveButton: {
    backgroundColor: AppStyles.color.tint,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
  },

  profileHeader: {
    marginTop: -400,
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileSection: {
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    justifyContent: "space-evenly"
  },
  sectionIcon: {
    marginRight: 10,
  },
  socialMediaIcon: {
    marginRight: 10,
    color: '#3b5998',
  },
  sectionLabel: {
    flex: 1,
    fontSize: 18,
  },
  sectionValue: {
    flex: 3,
    fontSize: 18,
    fontWeight: 'bold',
  },

});