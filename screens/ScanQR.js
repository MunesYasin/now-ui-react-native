import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from '../assets/config/axios';
import { TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InformationCard from "../components/informationCard"
import {
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import { AppStyles } from '../Appstyles';
import io from 'socket.io-client';
import { config } from '../assets/config/config';
import base64 from 'base-64';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  const [secretQrCode, setSecretQrCode] = useState(null)
  //-------------------------------------------------------------------------//


  //-------------------------------Effects----------------------------------//
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    let params = {}
    axios.post("/getMySecretArCode", params).then(res => {
      setSecretQrCode(res.data)
    }).catch(error => {
      console.log(error)
    })
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
              categouries: message
            }
            axios.post("/getUserBeanFromQrCode", params).then(res => {
              setUserDetails(res.data)
            }).catch(error => {
              alert(error);
            })
          }

          if (sender == connectToSocket.data.split("+")[0] && Array.isArray(message) && message.length == 0) {
            alert("the user doesnt want to appear anything")
            handleIgonerUser()
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
    console.log(data,"faffafafafaf")
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
    let params = {
      imageURL: userDetails.imageURL,
      full_name: userDetails.full_name,
      id: userDetails.id,
      secretQrCode: userDetails.secretQrCode,
      categouries: selectedCategorie
    }

    axios.post("/addUserToMyList", params).then(res => {
      handleIgonerUser()

    }).catch(error => {
      console.log(error)
    })
  }

  const handleViceVersaRequest = async () => {
    let userId = await AsyncStorage.getItem('userID');
    userId = base64.decode(userId)
    socket.emit("message",
      { sender: userId, message: selectedCategorie, receipient: connectToSocket.data.split("+")[0], secretQrCode })
  }

  const handleIgonerUser = () => {
    setShowDetailsModal(false)
    setUserDetails(null)
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

        <Modal
          isVisible={showDetailsModal}
          onSwipeComplete={() => handleIgonerUser()}
          swipeDirection={['down']}
          style={styles.modal}
          animationType="slide"
          transparent={true}
          animationDuration={100}
        >
          <View style={styles.viewContainer}>
            <View style={styles.titleDiv}>
              <TouchableOpacity onPress={() => {
                handleIgonerUser()
              }}>
                <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

              </TouchableOpacity>

            </View>
            {
              userDetails &&
              <>
                <InformationCard userDetails={userDetails} />
                <TouchableOpacity style={styles.saveButton} onPress={handleAddUser}>
                  <Text style={styles.saveButtonText}>Add user</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleViceVersaRequest}>
                  <Text style={styles.saveButtonText}>Send request</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleIgonerUser}>
                  <Text style={styles.saveButtonText}>Ignore User</Text>
                </TouchableOpacity>
              </>

            }
          </View>
        </Modal>
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
  modal: {
    width: "100%",
    margin: 0,
    marginTop: 75,

  },
  titleDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 50
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