

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  useWindowDimensions,
  Switch
} from 'react-native';
import { AppStyles } from '../Appstyles';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useCardAnimation } from '@react-navigation/stack';
// import { Ionicons } from '@expo/vector-icons';
import axios from '../assets/config/axios';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
// import * as WebBrowser from 'expo-web-browser';
import { AuthSession } from 'expo';

const ProfileScreen = (props) => {
  const { current } = useCardAnimation();
  const { height } = useWindowDimensions();
  const [showspecificInfoModal, setShowspecificInfoModal] = useState(false)
  const [specificInfoValue, setSpecificInfoValue] = useState("")
  const [getUserBeanAgain, setGetUserBeanAgain] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [alternativeNameSpecificValue, setAlternativeNameSpecificValue] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  //----------------------------------------------------------------------------------------//

  const handleImageUpload = () => {
    // Implement logic to upload profile picture
  };
  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  );

  const clientId = "89733021501-f6g7qnnuqu5f4keqp4rl206r439ljjit.apps.googleusercontent.com";
  const scope = 'https://www.googleapis.com/auth/drive.file';
  const REDIRECT_URI = "https://myapp.com/oauth2redirect"
  const CLIENT_SECRET = "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"

  const signInWithGoogleAsync = async () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    if (result.type === 'success') {
      const authCode = result.url.split('?code=')[1];
      // Exchange the authorization code for an access token
      // (see step 3 below)
      return exchangeAuthorizationCodeForToken(authCode)
    } else {
      console.log('Authentication failed');
    }
  };

  const exchangeAuthorizationCodeForToken = async (authCode) => {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const redirectUri = AuthSession.getRedirectUrl();
    const params = {
      code: authCode,
      redirect_uri: REDIRECT_URI,
      client_id: clientId,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
    };

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&'),
    });

    const result = await response.json();
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      try {
        let accessToken = await signInWithGoogleAsync()

        if (type === 'success') {
          const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';
          const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'image/jpeg',
          };
          const body = new FormData();
          body.append('image', {
            uri: result.assets[0].uri,
            name: 'image.jpg',
            type: 'image/jpeg',
          });

          const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
          });

          const result = await response.json();
        } else {
          console.log('Authentication failed');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    let params = {}
    axios.post("/getUserBean", params).then(res => {
      setProfileData(res.data)
    }).catch(error => {
      console.log(error)
    })
  }, [getUserBeanAgain])


  const handleSaveValue = () => {
    if (!specificInfoValue || !alternativeNameSpecificValue) return

    let params = {
      category: showspecificInfoModal.split(".")[0],
      name: showspecificInfoModal.split(".")[1],
      alternativeName: showspecificInfoModal.split(".")[2],
      value: specificInfoValue,
      show: showspecificInfoModal.split(".")[3],
      newAlternativeNameValue: alternativeNameSpecificValue
    }

    axios.put(`/updateUserBean`, params).then(res => {
      setGetUserBeanAgain(!getUserBeanAgain)
      handleCloseSpecificInfoModal()
    }).catch(error => {
      console.log(error, "error")
    })
  }


  const handleSaveFullName = () => {
    if (!specificInfoValue) return

    let params = {
      full_name: specificInfoValue
    }
    axios.put(`/updateFullName`, params).then(res => {
      setGetUserBeanAgain(!getUserBeanAgain)
      handleCloseSpecificInfoModal()
    }).catch(error => {

    })

  }

  const handleSaveValueDirect = (direct, handleShow, info) => {
    let params = {
      category: direct.split(".")[0],
      name: direct.split(".")[1],
      alternativeName: direct.split(".")[2],
      show: handleShow
    }
    axios.put(`/updateUserBeanDirect`, params).then(res => {
      setGetUserBeanAgain(!getUserBeanAgain)
      handleCloseSpecificInfoModal()
    }).catch(error => {
      console.log(error, "error")
      info.show = !info.show
    })
    
  }

  const handleCloseSpecificInfoModal = () => {
    setShowspecificInfoModal(false)
    setIsModalVisible(false)
    setSpecificInfoValue("")
    setAlternativeNameSpecificValue("")
  }
  const handleRemoveSpecificInfo = () => {

    let params = {
      specificCategoury: showspecificInfoModal.split(".")[0],
      specificInfo: showspecificInfoModal.split(".")[1],
      alternativeName: showspecificInfoModal.split(".")[2],
    }
    axios.post("/deleteInfoFeildFromProfile", params).then(res => {
      handleCloseSpecificInfoModal()
    }).catch(error => {

    })
  }

  useEffect(() => {
    if (showspecificInfoModal) {
      if (showspecificInfoModal.split(".")[0] == "full_name") {
        setSpecificInfoValue(profileData[showspecificInfoModal.split(".")[0]])
      } else {

        profileData[showspecificInfoModal.split(".")[0]].forEach(ele => {
          if (ele.name == showspecificInfoModal.split(".")[1] && (ele.alternativeName == showspecificInfoModal.split(".")[2])) {
            setSpecificInfoValue(ele.value)
            setAlternativeNameSpecificValue(ele.alternativeName)
          }
        })
      }
    }
  }, [showspecificInfoModal])


  // const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = (ele, info) => {
    info.show = !(JSON.parse(info.show))
    handleSaveValueDirect(`${ele[0]}.${info.name}.${info.alternativeName}`, info.show, info)
    // setIsEnabled(previousState => !previousState)
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <>
      <DismissKeyboard>


        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={pickImage}>

              <Image source={{ uri: profileData && profileData.imageURL ? profileData.imageURL : "https://via.placeholder.com/150" }} style={styles.profileImage} />

              <View style={{ position: "absolute", marginLeft: 45, bottom: -10 }}>
                <Ionicons name="camera-outline" size={60} color="white" />
              </View>

            </TouchableOpacity>

            <Text style={styles.profileName}>{profileData && profileData.full_name}</Text>
          </View>
          <ScrollView>

            <TouchableOpacity style={styles.blockContainer} onPress={() => {
              props.navigation.navigate('AddNewProfileData')

            }}>
              <View style={styles.iconContainer}>
                {/* <Image source={require('path/to/social/media/icon.png')} style={styles.icon} /> */}
                <Icon name={`plus`} size={30} />

                <Text style={styles.text}>Add new </Text>
              </View>

            </TouchableOpacity>

            {
              profileData && Object.entries(profileData).map(ele => {
                if (ele[0] != "imageURL") {
                  return (
                    <View>

                      {
                        ele[0] == "full_name" ?
                          <TouchableOpacity style={styles.blockContainer} onPress={() => {
                            setShowspecificInfoModal(`${ele[0]}.`)
                            setIsModalVisible(true)
                          }}>
                            <View style={styles.iconContainer}>
                              {/* <Image source={require('path/to/social/media/icon.png')} style={styles.icon} /> */}
                              <Icon name={`user`} size={30} />
                              <Text style={styles.text}>{ele[0]}</Text>
                            </View>

                          </TouchableOpacity>
                          :
                          <>
                            {
                              ele[1].length > 0 &&
                              <>
                                <Text style={{ ...styles.text, paddingTop: 10 }}>
                                  {ele[0]}
                                </Text>
                                {ele[1].map(info => {
                                  return (
                                    <TouchableOpacity style={styles.blockContainer} onPress={() => {
                                      setShowspecificInfoModal(`${ele[0]}.${info.name}.${info.alternativeName}.${(info.show)}`)
                                      setIsModalVisible(true)
                                    }}>
                                      <View style={styles.iconContainer}>
                                        {/* <Image source={require('path/to/social/media/icon.png')} style={styles.icon} /> */}

                                        <Icon name={`${info.name}`} size={30} style={styles.socialMediaIcon} />

                                        <Text style={styles.text}>{info.alternativeName}</Text>
                                      </View>
                                      <Switch
                                        trackColor={{ false: "#FFFFFF", true: "#8bb9e8" }}
                                        thumbColor={(info.show && JSON.parse(info.show)) ? "#FFFFFF" : "#C6C6C6"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch(ele, info)}
                                        value={(info.show && JSON.parse(info.show))}
                                      />
                                    </TouchableOpacity>
                                  )
                                })}
                              </>
                            }
                          </>
                      }

                    </View>
                  )
                }

              })
            }


          </ScrollView>
        </View>

      </DismissKeyboard>

      {
        showspecificInfoModal &&

        <Modal
          isVisible={isModalVisible}
          onSwipeComplete={() => handleCloseSpecificInfoModal()}
          swipeDirection={['down']}
          style={styles.modal}
          animationType="slide"
          transparent={true}
          animationDuration={100}
        >
          <View style={styles.viewContainer}>
            <>
              {
                showspecificInfoModal.split(".")[1] == "map-marker" ?


                  <View style={{ flex: 1, height: 20 }}>
                    <View style={styles.titleDiv}>
                      <TouchableOpacity onPress={() => {
                        handleCloseSpecificInfoModal()
                      }}>
                        <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

                      </TouchableOpacity>
                      <View>
                        <Text style={styles.titleText}>
                          {showspecificInfoModal.split(".")[1]}
                        </Text>
                      </View>
                      <View>

                      </View>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text>Alternative name</Text>

                      <TextInput
                        style={styles.inputField}
                        value={alternativeNameSpecificValue}
                        onChangeText={(e) => {
                          setAlternativeNameSpecificValue(e)
                        }}
                      />
                    </View>
                    {
                      specificInfoValue &&
                      <>


                        <MapView style={styles.map} initialRegion={specificInfoValue} onPress={(event) => {
                          const { latitude, longitude } = event.nativeEvent.coordinate;
                          setSpecificInfoValue({
                            latitude,
                            longitude,
                            latitudeDelta: specificInfoValue.latitudeDelta,
                            longitudeDelta: specificInfoValue.longitudeDelta,
                          })
                        }}>
                          <Marker coordinate={specificInfoValue} title="My Location" />
                        </MapView>
                        <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveValue()}>
                          <Text style={styles.saveButtonText}>Save Value</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.saveButton} onPress={handleCloseSpecificInfoModal}>
                          <Text style={styles.saveButtonText}>Cancel</Text>
                        </TouchableOpacity> */}
                      </>
                    }
                  </View>
                  :

                  <>
                    <View style={styles.titleDiv}>
                      <TouchableOpacity onPress={() => {
                        handleCloseSpecificInfoModal()
                      }}>
                        <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

                      </TouchableOpacity>
                      <View>
                        <Text style={styles.titleText}>
                          {showspecificInfoModal == "full_name." ? "full Name" : showspecificInfoModal.split(".")[1]}
                        </Text>
                      </View>
                      <View>

                      </View>
                    </View>



                    <View style={styles.iconDivInModal}>
                      <Icon name={showspecificInfoModal == "full_name." ? "user" : showspecificInfoModal.split(".")[1]} size={30} style={styles.socialMediaIcon} />
                      {
                        showspecificInfoModal != "full_name." &&
                        <Text>
                          {alternativeNameSpecificValue}
                        </Text>
                      }
                    </View>


                    <View style={styles.inputContainer}>
                      <Text>Value</Text>

                      <TextInput
                        style={styles.inputField}
                        value={specificInfoValue}
                        onChangeText={(e) => {
                          setSpecificInfoValue(e)
                        }}
                      />
                    </View>
                    {
                      showspecificInfoModal != "full_name." &&
                      <View style={styles.inputContainer}>
                        <Text>Alternative name</Text>

                        <TextInput
                          style={styles.inputField}
                          value={alternativeNameSpecificValue}
                          onChangeText={(e) => {
                            setAlternativeNameSpecificValue(e)
                          }}
                        />
                      </View>
                    }

                    <View style={{ height: "50%", flexDirection: "column", justifyContent: "flex-end" }}>

                      <View >


                        <TouchableOpacity

                          style={styles.saveButton}

                          onPress={() => {
                            showspecificInfoModal == "full_name." ?
                              handleSaveFullName()
                              :
                              handleSaveValue()
                          }
                          }>
                          <Text style={styles.saveButtonText}>Save Value</Text>
                        </TouchableOpacity>


                        {
                          showspecificInfoModal != "full_name." &&
                          <TouchableOpacity style={styles.saveButton} onPress={handleRemoveSpecificInfo}>
                            <Text style={styles.saveButtonText}>Remove</Text>
                          </TouchableOpacity>
                        }
                      </View>
                    </View>
                  </>
              }
            </>

          </View>
        </Modal>


      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50
  },
  modal: {
    width: "100%",
    margin: 0,
    marginTop: 75,

  },
  titleDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50
  },
  iconDivInModal: {
    backgroundColor: "#DCDCDC",
    maxHeight: 150,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"

  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,

  },
  viewAnimated: {
    width: '100%',
  },
  viewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    paddingTop: 20
  },
  map: {
    flex: 1,
    width: '100%',
    // height: "10%"
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  basicInfoContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  socialMediaContainer: {
    marginBottom: 20,
  },
  socialMediaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialMediaInputField: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginLeft: 10,
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
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
    justifyContent: "space-between",
    backgroundColor: "#e8e8e8",
    height: 50,
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20
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
    // fontWeight: 'bold',
    marginHorizontal: 10,
  },

  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  toggleButton: {
    borderRadius: 10,
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "white"
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;