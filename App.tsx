import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeModules,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import usePushNotification from './usePushNotification';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const enableGeo = () => {
    console.log(NativeModules.SalesforceModule.enableGeofence());
  };

  const setProfileId = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    NativeModules.SalesforceModule.setProfileId('74321574');
  };

  const isEnabledGeo = () => {
    console.log(
      'isEnabledGeo',
      NativeModules.SalesforceModule.getStatusGeofence(),
    );
  };

  const obtenerFirestore = () => {
    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids); // ['channel_id_1']
    });
  };

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <TouchableOpacity
          onPress={enableGeo}
          style={{
            backgroundColor: '#dedede',
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginHorizontal: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black'}}>Habilitar geolocalización</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={setProfileId}
          style={{
            backgroundColor: '#dedede',
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginHorizontal: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{color: 'black'}}>Guardar profile id</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={obtenerFirestore}
          style={{
            backgroundColor: '#dedede',
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginHorizontal: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{color: 'black'}}>Obtener canales push</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isEnabledGeo}
          style={{
            backgroundColor: '#dedede',
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginHorizontal: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{color: 'black'}}>¿Está activado la geo?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
