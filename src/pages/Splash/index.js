import React, {useEffect} from 'react';
import {View, StatusBar, Image, Text} from 'react-native';
import {splashLogo} from '../../assets';
import {useSelector} from 'react-redux';
import {colors} from '../../utils';
import DeviceInfo from 'react-native-device-info';

const Splash = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setTimeout(() => {
        if (LoginReducer.isIntro == 'true') {
          if (LoginReducer.isLogin == 'true') {
            navigation.replace('AdminDashboard');
          } else {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('Introduce');
        }
      }, 2000);
    }
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <View style={styles.wrapper.component}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.default}
      />
      <Image source={splashLogo} resizeMethod="resize" />
      <View style={{position: 'absolute', bottom: 30}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {DeviceInfo.getApplicationName()} V.{DeviceInfo.getVersion()}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    component: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.default,
    },
  },
};

export default Splash;
