import {Linking} from 'react-native';
import OneSignal from 'react-native-onesignal';
import PushNotification, {Importance} from 'react-native-push-notification';

export const configure = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function(notification) {
      console.log('NOTIFICATION:', notification);

      // process the notification
      Linking.openURL(notification.data.url);

      // (required) Called when a remote is received or opened, or local notification is opened
      //   notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function(notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

export const createChannelID = channel => {
  PushNotification.createChannel(
    {
      channelId: channel, // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

export const sendNotification = (channel, title, message) => {
  PushNotification.localNotification({
    channelId: channel,
    title: title, // (optional)
    message: message, // (required)
  });
};

export const sendNotificationSchedule = (channel, title, message) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    channelId: channel,
    message: message, // (required)
    date: new Date(Date.now() + 10 * 1000), // in 60 secs
    title: title,
  });
};

export const sendNotificationOneSignal = (header, message, id) => {
  const notificationObj = {
    headings: {en: header},
    contents: {en: message},
    include_player_ids: id,
  };
  const json = JSON.stringify(notificationObj);
  OneSignal.postNotification(
    json,
    success => {
      console.log(JSON.stringify(success));
    },
    failure => {
      console.log(JSON.stringify(failure));
    },
  );
};

export const sendBlastingNotification = message => {
  console.log(OneSignal);
};
