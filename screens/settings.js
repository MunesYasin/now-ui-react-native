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
  Switch,
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
import InformationCard from "../components/informationCard"
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

export default Onboarding = () => {
  //----------------------------------States-----------------------------------------//
  const [secretQrCode, setSecretQrCode] = useState(null);
  const [showAcceptCategoriesModal, setShowAcceptCategoriesModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [senderId, setSenderId] = useState(null)
  const [categoriesToggle, setCategoriesToggle] = useState({});
  const [userDetails, setUserDetails] = useState(null)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedCategorie, setSelectedCategouries] = useState(null)
  const [acceptCategoriesList, setAcceptCategoriesList] = useState(null)
  //------------------------------------------------------------------------------------//


  const { current } = useCardAnimation();
  const { height } = useWindowDimensions()

  useEffect(() => {
    const params = {};
    axios
      .post('/getMySecretArCode', params)
      .then((res) => {
        setSecretQrCode(res.data);


        const newSocket = io(config.backEndURL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
          const id = newSocket.id;
          setClientId(id);
          setSecretQrCode(`${id}+${res.data}`);

          newSocket.on('message', ({ sender, message, secretQrCode }) => {
            if (message == "please select options") {
              setShowAcceptCategoriesModal(true);
              setSenderId(sender)
            }

            if (Array.isArray(message) && message.length > 0) {
              const params = {
                id: sender,
                categouries: message,
                secretQrCode: secretQrCode
              }
              setSelectedCategouries(message)
              axios.post("/getUserBeanFromUserIDAfterScanning", params).then(res => {
                setShowUserDetailsModal(true)
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


    let params2 = {

    }
    axios.post("/getUserBean", params2).then(res => {
      setAcceptCategoriesList(res.data)
    }).catch(error => {
      console.log(error)
    })
  }, []);


  const acceptCategories = () => {

    let message = []
    Object.entries(categoriesToggle).forEach(ele => {
      if (ele[1]) {
        message.push(ele[0])
      }
    })
    socket.emit('message',
      { sender: clientId, message: message, receipient: senderId });
    setShowAcceptCategoriesModal(false);
    handleIgnorUser()
  }
  const handleLinkedInClick = async (ele) => {
    await Linking.openURL(ele.value);
  }

  const ignorCategories = () => {


    socket.emit('message',
      { sender: clientId, message: [], receipient: senderId });
    setShowAcceptCategoriesModal(false);
    handleIgnorUser()
  }
  const handleAddUser = () => {


    let params = {
      imageURL: userDetails.imageURL,
      id: userDetails.id,
      full_name: userDetails.full_name,
      categouries: selectedCategorie,
      secretQrCode: userDetails.secretQrCode,
    }
    axios.post("/addUserToMyList", params).then(res => {
      handleIgnorUser()

    }).catch(error => {
      console.log(error)
    })
  }

  const handleIgnorUser = () => {
    setShowUserDetailsModal(false)
    setUserDetails(null)
    setCategoriesToggle({})
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

        <Modal
          isVisible={showAcceptCategoriesModal}
          onSwipeComplete={() => ignorCategories()}
          swipeDirection={['down']}
          style={styles.modal}
          animationType="slide"
          transparent={true}
          animationDuration={100}
        >
          <View style={styles.viewContainer}>
            <View style={styles.titleDiv}>
              <TouchableOpacity onPress={() => {
                ignorCategories()
              }}>
                <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

              </TouchableOpacity>
              <View>
                <Text style={styles.titleText}>
                  Select categouries
                </Text>
              </View>
              <View>

              </View>
            </View>
            {
              acceptCategoriesList && Object.entries(acceptCategoriesList).map(ele => {
                if (ele[1] && Array.isArray(ele[1]) && ele[1].length > 0) {
                  return (
                    <View style={styles.blockContainer}>
                      <View style={styles.iconContainer}>
                        <Text style={styles.text}>{ele[0]}</Text>
                      </View>

                      <Switch
                        trackColor={{ false: "#FFFFFF", true: "#8bb9e8" }}
                        thumbColor={categoriesToggle[ele[0]] ? "#FFFFFF" : "#C6C6C6"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setCategoriesToggle({ ...categoriesToggle, [ele[0]]: categoriesToggle[ele[0]] ? !categoriesToggle[ele[0]] : true })}
                        value={categoriesToggle[ele[0]]}
                      />
                    </View>
                  )
                }
              })
            }
            <View style={{ height: "50%", flexDirection: "column", justifyContent: "flex-end" }}>
              {/* <View style={styles.buttonContainer}> */}
              <TouchableOpacity style={styles.saveButton} onPress={() => acceptCategories()}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => ignorCategories()}>
                <Text style={styles.saveButtonText}>Ignore</Text>
              </TouchableOpacity>
              {/* </View> */}
            </View>
          </View>
        </Modal>
      }


      {
        showUserDetailsModal && userDetails &&

        <Modal
          isVisible={showUserDetailsModal && userDetails}
          onSwipeComplete={() => handleIgnorUser()}
          swipeDirection={['down']}
          style={styles.modal}
          animationType="slide"
          transparent={true}
          animationDuration={100}
        >
          <View style={styles.viewContainer}>
            <View style={styles.titleDiv}>
              <TouchableOpacity onPress={() => {
                handleIgnorUser()
              }}>
                <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

              </TouchableOpacity>

            </View>
            {
              <>
                <InformationCard userDetails={userDetails} />
                <TouchableOpacity style={styles.saveButton} onPress={handleAddUser}>
                  <Text style={styles.saveButtonText}>Add user</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleIgnorUser}>
                  <Text style={styles.saveButtonText}>Ignore</Text>
                </TouchableOpacity>
              </>

            }
          </View>
        </Modal>
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
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 10,
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
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
    justifyContent: "space-between",
    backgroundColor: "#DCDCDC",
    height: 50,
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20
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
    padding: 15,
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
    ...AppStyles.buttonShadow
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