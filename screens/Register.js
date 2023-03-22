import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { AppStyles } from '../Appstyles';
import base64 from 'base-64';

import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import { TextInput } from 'react-native-paper';
import axios from "../assets/config/axios"
import superagent from "superagent"
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const phoneRegex = /^0[1-9]\d{8}$/
const justNumber = /^[0-9]+$/
const checkPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
  : `api.example.com`;

const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      password: null,
      agreement: false,
      loading: false,
      // disabled: true,
      // buttonColor: "warning",
      showAlert: false,
      registerResMessage: "",
      isValidUserName: true,
      isValidUserNameMessage: "",
      isValidPassword: true,
      isValidPasswordMessage: ""
    }
  }

  setUserName = (e) => {
    this.setState({ userName: e })
  }
  setPassword = (e) => {
    this.setState({ password: e })
  }

  storeTokenUserID = async (token, userID) => {
    try {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userID', userID);

    } catch (error) {
        console.log(error);
    }
};
  onRegister = () => {

    if (justNumber.test(this.state.userName)) {
      if (!phoneRegex.test(this.state.userName)) {
        this.setState({ isValidUserNameMessage: "* Mobile phone is not correct", isValidUserName: false })
        return
      }
      else {
        this.setState({ isValidUserNameMessage: "", isValidUserName: true })

      }
    } else if (!emailRegex.test(this.state.userName)) {
      this.setState({ isValidUserNameMessage: "* Email is not correct", isValidUserName: false })
      return
    } else {
      this.setState({ isValidUserNameMessage: "", isValidUserName: true })

    }

    if (!checkPasswordRegex.test(this.state.password)) {
      this.setState({ isValidPasswordMessage: "* Password should at least 6 digits , one uppercase letter and one , one lowercase letter, and one digit", isValidPassword: false })
      return
    } else {
      this.setState({ isValidPasswordMessage: "", isValidPassword: true })

    }

    this.setState({ loading: true })

    let params = {
      user_name: this.state.userName,
      password: this.state.password,
      // id: 32
    }

    axios.post("/signup", params).then(res => {
      this.setState({ registerResMessage: "success Sign up", loading: false, showAlert: true })
      this.storeTokenUserID(res.data.token,base64.encode( res.data.user.id))
      this.props.navigation.navigate('VarificationAccount')
    }).catch(error => {
      console.log(error)
      this.setState({ registerResMessage: "cannot sign up", loading: false, showAlert: true })

    })




  }



  render() {
    const { navigation } = this.props;

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>

          <Block width={width * 0.8}>
            <Input
              placeholder="Email or mobile phone"
              onChangeText={(e) => this.setUserName(e)}
              value={this.state.userName}
              style={[styles.inputs, { borderColor: this.state.isValidUserName ? '#E3E3E3' : 'red' }]}
              iconContent={
                <Icon
                  size={16}
                  color="#ADB5BD"
                  name="email-852x"
                  family="NowExtra"
                  style={styles.inputIcons}
                />
              }
            />
            {!this.state.isValidUserName && (
              <Text size={12} style={styles.errorMessage}>
                {/* * Please enter a valid email or mobile phone number */}
                {this.state.isValidUserNameMessage}
              </Text>
            )}
          </Block>
          <Block width={width * 0.8}>
            <Input
              placeholder="Password"
              style={[styles.inputs, { borderColor: this.state.isValidPassword ? '#E3E3E3' : 'red' }]}
              onChangeText={(e) => this.setPassword(e)}
              value={this.state.password}
              iconContent={
                <Icon
                  size={16}
                  color="#ADB5BD"
                  name="email-852x"
                  family="NowExtra"
                  style={styles.inputIcons}
                />
              }
            />
            {!this.state.isValidPassword && (
              <Text size={12} style={styles.errorMessage}>
                {/* * Please enter a valid email or mobile phone number */}
                {this.state.isValidPasswordMessage}
              </Text>
            )}
          </Block>
          <FancyAlert
            visible={this.state.showAlert}
            icon={<View style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'red',
              borderRadius: 50,
              width: '100%',
            }}><Text>🤓</Text></View>}
            style={{ backgroundColor: 'white' }}
          >
            <Text style={{ marginTop: -16, marginBottom: 32 }}>{this.state.registerResMessage}</Text>

            <Button color="primary" round style={styles.createButton} onPress={() => { this.setState({ showAlert: false }) }} >
              <Text
                style={{ fontFamily: 'montserrat-bold' }}
                size={14}
                color={nowTheme.COLORS.WHITE}
              >
                ok
              </Text>
            </Button>
          </FancyAlert>
          <TouchableOpacity
            disabled={!this.state.userName || !this.state.password}

            style={[styles.facebookContainer, { marginTop: 50 }]}
            onPress={() => this.onRegister()}>
            <Text style={styles.facebookText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  // inputs: {
  //   borderWidth: 1,
  //   borderRadius: 3,
  //   paddingLeft: 8,
  //   paddingRight: 8,
  //   height: 48,
  // },
  // inputIcons: {
  //   marginRight: 12,
  // },
  errorMessage: {
    color: 'red',
    marginTop: 4,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});

export default Register;



