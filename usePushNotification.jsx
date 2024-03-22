/* eslint-disable prettier/prettier */
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.configure({
  onNotification: function (notification) {
    if (notification.foreground) {
      console.log('Notification',notification);
      if (notification.data)
      { PushNotification.localNotification({
        channelId: 'com.salesforce.marketingcloud.DEFAULT_CHANNEL',
        title: notification.data.title,
        subTitle: notification.data.subtitle,
        message: notification.data.alert,
        bigPictureUrl: notification.data._mediaUrl,
        largeIconUrl:notification.data._mediaUrl,
        vibrate: true,
        priority: 'high',
      });

      } else {
        PushNotification.localNotification({
          channelId: 'com.salesforce.marketingcloud.DEFAULT_CHANNEL',
          title: notification.title,
          message: 'Mensaje por defecto',
          bigPictureUrl:
            'https://images2.minutemediacdn.com/image/upload/c_crop,h_3236,w_5760,x_0,y_0/v1554700227/shape/mentalfloss/istock-609802128.jpg',
          largeIconUrl:
            'https://images2.minutemediacdn.com/image/upload/c_crop,h_3236,w_5760,x_0,y_0/v1554700227/shape/mentalfloss/istock-609802128.jpg',
          vibrate: true,
          priority: 'high',
        });
      }

    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});
const usePushNotification = () => {
  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      console.log('PermissionsAndroid', res);
    }
  };

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND v3)',
        JSON.stringify(remoteMessage),
      );

      console.log('values');
      // PushNotification.localNotification({
      //   channelId: 'channel-id',
      //   title: remoteMessage.notification.title,
      //   message: remoteMessage.notification.message,
      // });
      // PushNotification.localNotification({
      //   channelId: 'channel-id',
      //   title: 'Titulo',
      //   message: 'Mensaje',
      //   bigPictureUrl: remoteMessage.notification.image,
      //   largeIconUrl: remoteMessage.notification.image,
      //   messageId:remoteMessage.messageId,
      //   ignoreInForeground: false,
      //   soundName: 'ios11payment',
      //   priority: 'high',
      //   vibrate: true,
      //   vibration: 300,
      //   // foreground: true,
      // });
    });
    return unsubscribe;
  };

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if (message) {
      console.log(
        'App opened from QUIT by tapping notification:',
        JSON.stringify(message),
      );
    }
  };

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;
