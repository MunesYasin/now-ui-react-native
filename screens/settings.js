import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Dimensions,
  Pressable,
  StyleSheet,
  Linking,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyles } from '../Appstyles';
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';
import axios from '../assets/config/axios';
import { Button } from 'react-native-paper';
import * as Facebook from 'expo-facebook';
import { TextInput, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import {
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import io from 'socket.io-client';
import { config } from '../assets/config/config';
import QRCode from 'react-native-qrcode-svg';
import Hyperlink from 'react-native-hyperlink';

export default Onboarding = () => {
  //----------------------------------States-----------------------------------------//
  const [secretQrCode, setSecretQrCode] = useState(null);
  const [showAcceptCategoriesModal, setShowAcceptCategoriesModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [senderId, setSenderId] = useState(null)
  const [socialToggle, setSocialToggle] = useState(false);
  const [personalToggle, setPersonalToggle] = useState(false);
  const [userDetails, setUserDetails] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCategorie, setSelectedCategouries] = useState(null)
  //------------------------------------------------------------------------------------//


  const { current } = useCardAnimation();
  const { height } = useWindowDimensions()

  useEffect(() => {
    const params = {};
    axios
      .post('/getUserBean', params)
      .then((res) => {
        setSecretQrCode(res.data.secretQrCode);


        const newSocket = io(config.backEndURL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
          const id = newSocket.id;
          setClientId(id);
          setSecretQrCode(`${id}+${res.data.secretQrCode}`);

          newSocket.on('message', ({ sender, message }) => {
            if (message == "please select options") {
              setShowAcceptCategoriesModal(true);
              setSenderId(sender)
            }

            if (Array.isArray(message) && message.length > 0) {
              const params = {
                id: sender,
                categouries: message
              }
              setSelectedCategouries(message)
              axios.post("/getUserBeanFromUserID", params).then(res => {
                setShowDetailsModal(true)

                setUserDetails(res.data)
              }).catch(error => {
                console.log(error)
              })
            }
          });
        });

        return () => {
          newSocket.disconnect();
          setSocket(null);
          setClientId(null);
        };
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSave = () => { };

  const acceptCategories = () => {

    let message = []
    socialToggle && message.push("socialMedia")
    personalToggle && message.push("personalInfo")
    socket.emit('message',
      { sender: clientId, message: message, receipient: senderId });
    setShowAcceptCategoriesModal(false);

  }
  const handleLinkedInClick = async (ele) => {
    await Linking.openURL(ele.value);
  }

  const ignorCategories = () => {


    socket.emit('message',
      { sender: clientId, message: [], receipient: senderId });
    setShowAcceptCategoriesModal(false);

  }
  const handleAddUser = () => {

    let params ={}
    userDetails.personalInfo &&
      (
        userDetails.personalInfo.forEach(ele => {
          if (ele.name == "name") {
            params.name = ele.value
          }
          if (ele.name == "imageURL") {
            params.imageURL = ele.value
          }
        })

      )
    params = {
      ...params,
      id: userDetails.id,
      categouries: selectedCategorie
    }
    axios.post("/addUserToMyList", params).then(res => {
      setShowDetailsModal(false)

    }).catch(error => {
      console.log(error)
    })
  }
  return (
    <View style={styles.container}>
      <QRCode
        value={secretQrCode ? secretQrCode : "none"}
        size={200}
        color="#000"
        backgroundColor="#fff"
      />



      {
        showAcceptCategoriesModal &&
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            position: "absolute"
          }}>
          <Animated.View
            style={[
              {
                height: height,
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, height * 0.5],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
              styles.viewAnimated,
            ]}>
            <View style={styles.viewContainer}>
              {/* <View style={styles.container}> */}
              <View style={styles.blockContainer}>
                <View style={styles.iconContainer}>
                  {/* <Image source={require('path/to/social/media/icon.png')} style={styles.icon} /> */}
                  <Text style={styles.text}>Social Media</Text>
                </View>
                <TouchableOpacity style={styles.toggleButton} onPress={() => setSocialToggle(!socialToggle)}>
                  <Text style={styles.toggleText}>{socialToggle ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.blockContainer}>
                <View style={styles.iconContainer}>
                  {/* <Image source={require('path/to/personal/info/icon.png')} style={styles.icon} /> */}
                  <Text style={styles.text}>Personal Information</Text>
                </View>
                <TouchableOpacity style={styles.toggleButton} onPress={() => setPersonalToggle(!personalToggle)}>
                  <Text style={styles.toggleText}>{personalToggle ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => acceptCategories()}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => ignorCategories()}>
                  <Text style={styles.buttonText}>Ignore</Text>
                </TouchableOpacity>
              </View>

              {/* </View> */}
            </View>
          </Animated.View>

        </View >
      }


      {
        showDetailsModal && userDetails &&

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            position: "absolute"
          }}>
          <Animated.View
            style={[
              {
                height: height,

                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, height * 0.25],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
              styles.viewAnimated,
            ]}>
            <View style={styles.viewContainer}>
              {

                <View style={styles.container}>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileImageWrapper}>
                      <Image
                        source={{ uri: 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                      />
                    </View>
                    <Text style={styles.profileName}>{userDetails.personalInfo && userDetails.personalInfo.name}</Text>
                  </View>
                  <View style={styles.profileSection}>


                    {/* ----------------------------------Personal Info section-------------------------------- */}
                    {
                      userDetails.personalInfo &&
                      userDetails.personalInfo.map(ele => {
                        return (
                          <>
                            <View style={styles.sectionRow}>
                              <Ionicons name="mail-outline" size={24} style={styles.sectionIcon} />
                              <Text style={styles.sectionLabel}>{ele.name}:</Text>
                              <Text style={styles.sectionValue}>{ele.value}</Text>
                            </View>
                          </>
                        )
                      })
                    }
                    {/* ----------------------------------Personal Info section-------------------------------- */}


                    {/* ----------------------------------Social media section-------------------------------- */}
                    {
                      userDetails.socialMedia &&
                      <View style={styles.sectionRow}>

                        {
                          userDetails.socialMedia.map(ele => {
                            return (
                              <Ionicons name={`logo-${ele.name}`} size={50} style={styles.socialMediaIcon} onPress={() => handleLinkedInClick(ele)} />
                            )
                          })
                        }
                      </View>
                    }
                    {/* ----------------------------------Social media section-------------------------------- */}


                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={handleAddUser}>
                    <Text style={styles.saveButtonText}>Add user</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={styles.saveButton} onPress={handleViceVersaRequest}>
                    <Text style={styles.saveButtonText}>Send request</Text>
                  </TouchableOpacity> */}
                </View>
              }
            </View>
          </Animated.View>
        </View >
      }

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
    justifyContent: "space-between"
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  toggleButton: {
    borderRadius: 10,
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: "center",
    // marginTop: 150
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  viewContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    width: "100%",
    paddingTop: 30
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 200,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  brief: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  terms: {
    marginTop: 0,
    fontSize: 20,
    // fontWeight: 'bold',
    color: "blue",
    borderBottomColor: "blue",
    borderBottomWidth: 1
  },
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  signupContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.tint,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.tint,
  },
  spinner: {
    marginTop: 200,
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
    // flex: 1,
    fontSize: 18,
  },
  sectionValue: {
    // flex: 3,
    fontSize: 18,
    fontWeight: 'bold',
  },

});