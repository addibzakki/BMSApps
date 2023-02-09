import React from 'react';
import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {authLogOut, clearProfileId} from '../../redux';
import {colorLogo} from '../../utils';
import {userAvatar} from '../../assets';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {sendNotificatioOneSignal} from '../../component';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

function ButtonProfile() {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colorLogo.color2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 10,
        flexDirection: 'row',
        width: wp('40%'),
      }}>
      <Icon name="md-person-outline" size={24} color="white" />
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        Profile
      </Text>
    </TouchableOpacity>
  );
}

function ButtonLogout(props) {
  return (
    <TouchableOpacity
      onPress={() => props.handleLogOut()}
      style={{
        backgroundColor: colorLogo.color1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 10,
        flexDirection: 'row',
        width: wp('40%'),
      }}>
      <Icon name="md-log-out-outline" size={24} color="white" />
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        Log Out
      </Text>
    </TouchableOpacity>
  );
}

function Avatar(props) {
  return (
    <View style={styles.wrapper.avatar}>
      <View
        style={{
          borderWidth: 2,
          borderColor: colorLogo.color5,
          borderRadius: 75,
          width: 150,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.imageSource}
      </View>
    </View>
  );
}

const Profile = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const ProfileIdReducer = useSelector(state => state.ProfileIdReducer);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    axios
      .post('https://mmpportal.mmproperty.com/api/unsubscribed_notif', {
        username: LoginReducer.form.profile.uid,
        player_id: ProfileIdReducer.profile_id,
      })
      .then(function(response) {
        console.log(response.data);
        // console.log(response.data.message);
        dispatch(clearProfileId());
      })
      .catch(function(error) {
        console.log(error);
      });
    dispatch(authLogOut());
    navigation.replace('Login');
  };

  var imageSource = '';
  if (
    !(
      LoginReducer.form.profile.profile_photo == '' ||
      LoginReducer.form.profile.profile_photo == null
    )
  ) {
    imageSource = (
      <Image
        source={{
          uri: LoginReducer.form.profile.profile_photo,
        }}
        style={{flex: 1, width: null, alignSelf: 'stretch', borderRadius: 100}}
      />
    );
  } else {
    imageSource = (
      <Image
        source={userAvatar}
        style={{flex: 1, width: null, alignSelf: 'stretch', borderRadius: 100}}
      />
    );
  }

  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colorLogo.color4}
      />
      <View style={styles.wrapper.top_container}>
        <Avatar imageSource={imageSource} />
        <View style={styles.space(10)} />
      </View>
      <View style={styles.space(10)} />
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 20,
          marginHorizontal: 20,
          justifyContent: 'space-between',
          width: wp('90%'),
        }}>
        <ButtonProfile />
        <ButtonLogout handleLogOut={handleLogOut} />
      </View>

      <View style={styles.space(20)} />

      <View style={styles.wrapper.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: wp('20%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              Name
            </Text>
          </View>
          <View style={{width: wp('80%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              {' '}
              : {LoginReducer.form.profile.name}
            </Text>
          </View>
        </View>
        <View style={styles.space(10)} />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: wp('20%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              Level
            </Text>
          </View>
          <View style={{width: wp('80%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              {' '}
              : {LoginReducer.form.profile.level}
            </Text>
          </View>
        </View>
        <View style={styles.space(10)} />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: wp('20%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              Entity
            </Text>
          </View>
          <View style={{width: wp('80%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              {' '}
              : {LoginReducer.form.profile.company}
            </Text>
          </View>
        </View>
        <View style={styles.space(10)} />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: wp('20%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              Email
            </Text>
          </View>
          <View style={{width: wp('80%')}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap'}}>
              {' '}
              : {LoginReducer.form.profile.mail}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.space(15)} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{position: 'absolute', bottom: 30}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {DeviceInfo.getApplicationName()} V.{DeviceInfo.getVersion()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
    top_container: {
      backgroundColor: colorLogo.color4,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    profile: {
      paddingRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    content: {
      borderColor: 'white',
      backgroundColor: 'white',
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default Profile;
