/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
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
  TextInput,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const enableGeo = () => {
    NativeModules.SalesforceModule.enableGeofence();
  };

  const setProfileId = () => {
    NativeModules.SalesforceModule.setProfileId('74321574');
  };

  const isEnabledGeo = () => {
    setEnableGeo(NativeModules.SalesforceModule.getStatusGeofence());
  };

  const obtenerFirestore = () => {

  };

  const obtenerSDK = () => {
    console.log(NativeModules.SalesforceModule.getSDKState());
  };

  useEffect(() => {
    setProfileId();
    setContactKey(NativeModules.SalesforceModule.getContactKey());
  }, []);

  const [contactKey, setContactKey] = useState('74321574');
  const [channels, setChannels] = useState([]);
  const [enableGeofence, setEnableGeo] = useState(false);

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
        <TextInput
          value={contactKey}
          onChange={evt => setContactKey(evt.nativeEvent.text)}
          placeholder="Escribrir contact key"
          placeholderTextColor={'#000'}
          style={{
            height: 50,
            width: '95%',
            borderRadius: 10,
            marginHorizontal: 10,
            backgroundColor: '#fffefe',
            color: '#000',
          }}
        />
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
            marginTop: 20,
          }}>
          <Text style={{color: 'black'}}>Habilitar geolocalización</Text>
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
        {channels.length > 0 && (
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 15,
              backgroundColor: '#65c4fb',
              paddingHorizontal: 8,
              paddingVertical: 5,
            }}>
            {channels.map(channel => (
              <Text key={channel} style={{color: '#000'}}>
                {channel}
              </Text>
            ))}
          </View>
        )}
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
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 15,
            backgroundColor: '#65c4fb',
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}>
          <Text style={{color: 'black'}}>{enableGeofence ? 'Sí' : 'No'}</Text>
        </View>
        <TouchableOpacity
          onPress={obtenerSDK}
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
          <Text style={{color: 'black'}}>Obtener Estado SDK</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


export default App;
