import axios from 'axios';
import { config } from "./config"
import  AsyncStorage  from '@react-native-async-storage/async-storage';

const instance = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/x-www-form-urlencoded", 
    Accept: 'Application/json',

  },
  Authorization: 'jwt',
  // mode: 'cors',
  baseURL: config.backEndURL,
  timeout: 600000000,
  responseType: 'json',
  validateStatus: function (status) {
    return status < 500;
  },
  withCredentials: true,
  xsrfCookieName:"jwt",
  xsrfHeaderName:"jwt"

});

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      return token;
    }
  } catch (error) {
    console.log(error);
  }
};



// Add a request interceptor
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    let token =await getToken();


    console.log(config,"++++++++++++++++++++++++++++++++++++++++++++")




    config.data.token=token
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


export default instance;


