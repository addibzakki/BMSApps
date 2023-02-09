import PushNotification from 'react-native-push-notification';

const showNotification = (title, message, subtext = '', bigtext = '') => {
    PushNotification.createChannel(
        {
          channelId: "com.mmpbmsappeng", // (required)
          channelName: "com.mmpbmsappeng", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

      PushNotification.localNotification({
        channelId: "com.mmpbmsappeng",
        autoCancel: true,
        bigText: bigtext,
        subText: subtext,
        title: title,
        message: message,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
      });

      PushNotification.getChannels(function (channel_ids) {
        console.log(channel_ids); // ['channel_id_1']
      });
};

const handleScheduleNotification = (title, message) => {
    PushNotification.localNotificationSchedule({
        title: title,
        message: message,
        date: new Date(Date.now() + 5*1000),
    })
};

const handleCancel = () => {
    PushNotification.cancelAllLocalNotifications();
}

export {showNotification, handleScheduleNotification, handleCancel};