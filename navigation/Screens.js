import { Animated, Dimensions, Easing, Text } from 'react-native';
// header for screens
import { Header } from '../components';
import BottomNavigation from "../components/bottomBar"
import { nowTheme, tabs } from '../constants';
import Articles from '../screens/Articles';
import { Block } from 'galio-framework';
import Components from '../screens/Components';
// drawer
import CustomDrawerContent from './Menu';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

// screens
import Home from '../screens/Home';
import Onboarding from '../screens/Onboarding';
// import Pro from '../screens/Pro';
import Profile from '../screens/Profile';
import React from 'react';
import Register from '../screens/Register';
import Account from '../screens/Account';
import SignIn from "../screens/SignIn"
import Settings from '../screens/settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { func } from 'prop-types';
import ScanQR from '../screens/ScanQR'
import OtherUserDetails from "../screens/otherUserDetails"
import Welcome from "../screens/welcome"
import Icon from 'react-native-vector-icons/Ionicons';
import VarificationAccount from "../screens/VarificationAccount"
const { width } = Dimensions.get('screen');
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



function RegisterStack(props) {




  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Register"
        component={Register}

      />

    </Stack.Navigator>
  );
}

function SignInStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignIn}
      />

    </Stack.Navigator>
  );
}
function VarificationAccountStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="VarificationAccount"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="VarificationAccount"
        component={VarificationAccount}
      />

    </Stack.Navigator>
  );
}



function AccountStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          header: ({ navigation, scene }) => (
            <Header transparent title="Update Account" navigation={navigation} scene={scene} />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header transparent white title="Profile" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: '#FFFFFF' },
          headerTransparent: true,
        }}
      />
      {/* <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="" back white transparent navigation={navigation} scene={scene} />
          ),
          headerTransparent: true,
        }}
      /> */}
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Home" search options navigation={navigation} scene={scene} />


          ),
          cardStyle: { backgroundColor: '#FFFFFF' },

        }}

      />
      {/* <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="" back white transparent navigation={navigation} scene={scene} />
          ),
          headerTransparent: true,
        }}
      /> */}
    </Stack.Navigator>
  );
}

function ScanQrStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Scan QR"
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Scan QR"
        component={ScanQR}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Scan QR" navigation={navigation} scene={scene} />
          ),
          backgroundColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (

    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused
            ? 'person'
            : 'person-outline';
        } else if (route.name === 'Scan') {
          iconName = focused
            ? 'scan'
            : 'scan-outline';
        } else if (route.name === 'Settings') {
          iconName = focused
            ? 'settings'
            : 'settings-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Profile" component={Profile} />
    <Tab.Screen name="Scan" component={ScanQR} />
    <Tab.Screen name="Settings" component={Settings} />

  </Tab.Navigator>
  );
}

export default function OnboardingStack(props) {

  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        option={{
          headerTransparent: true,
         
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true,
        }}
        
      />
      <Stack.Screen name="Sign_up" component={RegisterStack} />
      <Stack.Screen name="VarificationAccount" component={VarificationAccountStack} />

      <Stack.Screen name="Sign_In" component={SignInStack} />
      <Stack.Screen
        options={{
            // gestureEnabled: false
          }}
           name="App" component={AppStack} />
      <Stack.Screen name="OtherUserDetails" component={OtherUserDetails} />

    </Stack.Navigator>

  );
}
