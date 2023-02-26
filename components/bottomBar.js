import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Home from '../screens/Home';
import ScanQr from "../screens/ScanQR"
import Profile from "../screens/Profile"
const MyComponent = (props) => {
const HomeRoute = () =><Home/>;

const ProfileRoute = () => <Profile />;

const ScanQrRoute = () => <ScanQr />;
const SettingsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'music', title: 'Home', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    { key: 'albums', title: 'Profile', focusedIcon: 'album' },
    { key: 'recents', title: 'Sacn qr', focusedIcon: 'history' },
    { key: 'notifications', title: 'Settings', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: HomeRoute,
    albums: ProfileRoute,
    recents: ScanQrRoute,
    notifications :SettingsRoute
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;