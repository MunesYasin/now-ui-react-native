import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from '../assets/config/axios';
import { Modal, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import { AppStyles } from '../Appstyles';
import io from 'socket.io-client';
import { config } from '../assets/config/config';


export default function ScanQR() {
  //--------------------------------States------------------------------------//
  const [hasPermission, setHasPermission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null)
  const { height } = useWindowDimensions();
  const { current } = useCardAnimation();
  const [scanned, setScanned] = useState(false);
  const [socket, setSocket] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [connectToSocket, setConnectToSocket] = useState(null)
  const [selectedCategorie, setSelectedCategorie] = useState(null)


  //-------------------------------------------------------------------------//


  //-------------------------------Effects----------------------------------//
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {

    // Connect to the WebSocket server
    if (connectToSocket) {
      setShowDetailsModal(true)


      const newSocket = io(config.backEndURL);
      setSocket(newSocket);

      // When the connection is established, get the client ID
      newSocket.on('connect', () => {

        const id = newSocket.id;
        setSenderId(id);
        newSocket.emit('message',
          { sender: id, message: 'please select options', receipient: connectToSocket.data.split("+")[0] });

        newSocket.on('message', ({ sender, message }) => {

          if (sender == connectToSocket.data.split("+")[0] && Array.isArray(message) && message.length > 0) {
            setScanned(true);
            setSelectedCategorie(message)
            let params = {
              secretQrCode: connectToSocket.data.split("+")[1],
              // secretQrCode: "WWFz",
              categouries: message
            }
            axios.post("/getUserBeanFromQrCode", params).then(res => {

              // let userDetailTempObject = { id: res.data.id }
              // for (const key in res.data) {
              //   res.data[key].forEach(ele => {
              //     userDetailTempObject[key] = { ...userDetailTempObject[key], [ele.name]: ele.value }
              //   })
              // }
              setUserDetails(res.data)
            }).catch(error => {
              alert(error);
            })
          }

          if (sender == connectToSocket.data.split("+")[0] && Array.isArray(message) && message.length == 0) {

          }

        })
      });

      // Clean up the socket connection when the component is unmounted
      return () => {
        newSocket.disconnect();
        setSocket(null);
        setSenderId(null);
      };
    }
  }, [connectToSocket])
  //-------------------------------------------------------------------------//


  const handleBarCodeScanned = (data) => {
    setConnectToSocket(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  const handleLinkedInClick = async (ele) => {
    await Linking.openURL(ele.value);
  }

  const handleAddUser = () => {


    let params={}
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

  const handleViceVersaRequest = async () => {
    let userId = await AsyncStorage.getItem('userID');
    socket.emit("message",
      { sender: userId, message: selectedCategorie, receipient: connectToSocket.data.split("+")[0] })
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}

        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

      {
        showDetailsModal &&

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
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
                userDetails &&
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
                      // <>

                      //   <View style={styles.sectionRow}>
                      //     <Ionicons name="mail-outline" size={24} style={styles.sectionIcon} />
                      //     <Text style={styles.sectionLabel}>Email:</Text>
                      //     <Text style={styles.sectionValue}>{userDetails.personalInfo.email}</Text>
                      //   </View>
                      //   <View style={styles.sectionRow}>
                      //     <Ionicons name="call-outline" size={24} style={styles.sectionIcon} />
                      //     <Text style={styles.sectionLabel}>Phone:</Text>
                      //     <Text style={styles.sectionValue}>{userDetails.personalInfo.phoneNumber}</Text>
                      //   </View>
                      //   <View style={styles.sectionRow}>
                      //     <Ionicons name="location-outline" size={24} style={styles.sectionIcon} />
                      //     <Text style={styles.sectionLabel}>Location:</Text>
                      //     <Text style={styles.sectionValue}>{userDetails.personalInfo.location}</Text>
                      //   </View>
                      // </>
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
                  <TouchableOpacity style={styles.saveButton} onPress={handleViceVersaRequest}>
                    <Text style={styles.saveButtonText}>Send request</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </Animated.View>
        </View >
      }
    </View >
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