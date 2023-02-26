// import React from 'react';
// import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform, FlatList, Linking } from 'react-native';
// import { AppStyles } from '../Appstyles';
// import {
//   ActivityIndicator,
//   Text,
//   View,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';
// import  AsyncStorage  from '@react-native-async-storage/async-storage';
// import QRCode from 'react-native-qrcode-svg';
// import Hyperlink from "react-native-hyperlink"
// const { height, width } = Dimensions.get('screen');
// import { Images, nowTheme } from '../constants/';
// import { HeaderHeight } from '../constants/utils';
// import axios from '../assets/config/axios';
// import { Button } from 'react-native-paper';
// import * as Facebook from 'expo-facebook';

// export default class Onboarding extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       secretQrCode: null,
//     }
//   }


//   componentDidMount() {

//     let params = {

//     }
//     axios.post("/getUserBean", params).then(res => {
//       this.setState({ secretQrCode: res.data.secretQrCode })
//     }).catch(error => {
//       console.log(error)
//     })


//   }


//   async getAccountLink() {
//     // authenticate user and get access token
//     const result = await LoginManager.logInWithPermissions(['public_profile']);
//     if (result.isCancelled) {
//       // handle user cancelling login
//     } else {
//       const accessTokenData = await AccessToken.getCurrentAccessToken();
//       const accessToken = accessTokenData.accessToken.toString();
//       // get user's profile info, including link to Facebook profile
//       const response = await fetch(`https://graph.facebook.com/v12.0/me?access_token=${accessToken}&fields=link`);
//       const userData = await response.json();
//       // userData.link contains the link to the user's Facebook profile
//       console.log(userData.link, "--l-l-l-l-l-l-l-l-l-l-l-l-l-l-l-l-l--ll--l-l-l-l-l");
//     }
//   }

//   async handleFacebookAuth   ()  {


//     try {
//       await Facebook.initializeAsync({
//         appId: '2332490690244344',
//       });

//       const { type, token } = await Facebook.logInWithReadPermissionsAsync({
//         permissions: ['public_profile'],
//       });

//       if (type === 'success') {
//         const profileResponse = await fetch(
//           `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture`
//         );

//         const profileJson = await profileResponse.json();
//         const profileLink = profileJson.id;
//         console.log(`Facebook profile link: https://www.facebook.com/${profileLink}/`);
//       } else {
//         console.log('Facebook login cancelled');
//       }
//     } catch (e) {
//       console.log('Facebook login error:', e);
//     }
//   };


//   render() {

//     return (
//       <View style={styles.container}>
//         <QRCode
//           value={this.state.secretQrCode ? this.state.secretQrCode : "none"}
//           size={200}
//           color="#000"
//           backgroundColor="#fff"
//         />

// <Button icon="camera" mode="contained" onPress={() => this.handleFacebookAuth()}>
//     Press me
//   </Button>
//       </View>
//     );
//   }
// }




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 150,
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
//   title: {
//     fontSize: AppStyles.fontSize.title,
//     fontWeight: 'bold',
//     color: AppStyles.color.tint,
//     marginTop: 200,
//     textAlign: 'center',
//     marginBottom: 20,
//     marginLeft: 20,
//     marginRight: 20,
//   },
//   brief: {
//     fontSize: AppStyles.fontSize.title,
//     fontWeight: 'bold',
//     color: AppStyles.color.tint,
//     marginTop: 20,
//     textAlign: 'center',
//     marginBottom: 20,
//     marginLeft: 20,
//     marginRight: 20,
//   },
//   terms: {
//     marginTop: 0,
//     fontSize: 20,
//     // fontWeight: 'bold',
//     color: "blue",
//     borderBottomColor: "blue",
//     borderBottomWidth: 1
//   },
//   loginContainer: {
//     alignItems: 'center',
//     width: AppStyles.buttonWidth.main,
//     backgroundColor: AppStyles.color.tint,
//     borderRadius: AppStyles.borderRadius.main,
//     padding: 10,
//     marginTop: 30,
//   },
//   loginText: {
//     color: AppStyles.color.white,
//   },
//   signupContainer: {
//     alignItems: 'center',
//     width: AppStyles.buttonWidth.main,
//     backgroundColor: AppStyles.color.white,
//     borderRadius: AppStyles.borderRadius.main,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: AppStyles.color.tint,
//     marginTop: 15,
//   },
//   signupText: {
//     color: AppStyles.color.tint,
//   },
//   spinner: {
//     marginTop: 200,
//   },
// });

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
  ScrollView
} from 'react-native';
import { AppStyles } from '../Appstyles';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from '../assets/config/axios';
const ProfileScreen = () => {

  //-------------------------------------State---------------------------------------------//
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [facebook, setFacebook] = useState('');
  // const [twitter, setTwitter] = useState('');
  // const [linkedin, setLinkedin] = useState('');
  // const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');

  const [socialMediaInfo, setSocialMediaInfo] = useState({
    facebook: "",
    twitter: "",
    linkedin: ""
  })
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileImage: "https://via.placeholder.com/150"
  })

  //----------------------------------------------------------------------------------------//






  const handleImageUpload = () => {
    // Implement logic to upload profile picture
  };
  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  );

  const handleSave = () => {
    // Implement logic to save profile data
    // let params = {
    //   full_name: name,
    //   phone: phoneNumber,
    //   email: email,
    //   linkedin: linkedin
    // }

    let params = {
      socialMedia: [],
      personalInfo: []
    }

    Object.entries(socialMediaInfo).forEach(ele => {
      params.socialMedia.push({
        name: ele[0],
        show: true,
        value: ele[1]
      })
    })

    Object.entries(personalInfo).forEach(ele => {
      params.personalInfo.push({
        name: ele[0],
        show: true,
        value: ele[1]
      })
    })

    axios.put("/updateUserBean", params).then(res => {
    }).catch(error => {

    })
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  useEffect(() => {
    let params = {

    }
    axios.post("/getUserBean", params).then(res => {

      let socialMediaTempObject = {}
      res.data.socialMedia.forEach(ele => {
        socialMediaTempObject[ele.name] = ele.value
      })
      setSocialMediaInfo(socialMediaTempObject)

      let personalInfoTempObject = {}
      res.data.personalInfo.forEach(ele => {
        personalInfoTempObject[ele.name] = ele.value
      })
      setPersonalInfo(personalInfoTempObject)

    }).catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <DismissKeyboard>
      <ScrollView>


        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={pickImage}>

              <Image source={{ uri: personalInfo.profileImage }} style={styles.profileImage} />

              <View style={{ position: "absolute", marginLeft: 45, bottom: -10 }}>
                <Ionicons name="camera-outline" size={60} color="white" />
              </View>

            </TouchableOpacity>

            <Text style={styles.profileName}>{personalInfo.name}</Text>
          </View>
          <View style={styles.basicInfoContainer}>
            <Text style={styles.sectionHeader}>Basic Information</Text>
            <View style={styles.inputContainer}>
              <Text>Full name</Text>
              <TextInput
                style={styles.inputField}
                value={personalInfo.name}
                onChangeText={(e) => {
                  // setName(e)
                  setPersonalInfo({ ...personalInfo, name: e })
                }}
                placeholder="Name"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>E-mail</Text>

              <TextInput
                style={styles.inputField}
                value={personalInfo.email}
                onChangeText={(e) => {
                  // setEmail(e)
                  setPersonalInfo({ ...personalInfo, email: e })

                }}
                placeholder="Email"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>Phone</Text>

              <TextInput
                style={styles.inputField}
                value={personalInfo.phoneNumber}
                onChangeText={(e) => {
                  // setPhoneNumber(e)
                  setPersonalInfo({ ...phoneNumber, name: e })

                }}
                placeholder="Phone Number"
              />
            </View>
          </View>
          <View style={styles.socialMediaContainer}>
            <Text style={styles.sectionHeader}>Social Media</Text>
            <View style={styles.socialMediaInputContainer}>
              <Icon name="logo-facebook" size={25} color="#3b5998" />
              <TextInput
                style={styles.socialMediaInputField}
                value={socialMediaInfo.facebook}
                onChangeText={(e) => {
                  // setFacebook(e)
                  setSocialMediaInfo({ ...socialMediaInfo, facebook: e })

                }}
                placeholder="Facebook"
              />
            </View>
            <View style={styles.socialMediaInputContainer}>
              <Icon name="logo-twitter" size={25} color="#00acee" />
              <TextInput
                style={styles.socialMediaInputField}
                value={socialMediaInfo.twitter}
                onChangeText={(e) => {
                  // setTwitter(e)
                  setSocialMediaInfo({ ...socialMediaInfo, twitter: e })

                }}
                placeholder="Twitter"
              />
            </View>
            <View style={styles.socialMediaInputContainer}>
              <Icon name="logo-linkedin" size={25} color="#0e76a8" />
              <TextInput
                style={styles.socialMediaInputField}
                value={socialMediaInfo.linkedin}
                onChangeText={(e) => {
                  // setLinkedin(e)
                  setSocialMediaInfo({ ...socialMediaInfo, linkedin: e })

                }}
                placeholder="LinkedIn"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DismissKeyboard>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50
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
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;