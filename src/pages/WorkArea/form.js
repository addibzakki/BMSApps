import React, {useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {avatar} from '../../assets';
import {global_style} from '../../styles';
import {colorLogo} from '../../utils';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
import {useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {sendNotificationOneSignal, TopHeader} from '../../component';
import {WorkAreaAPIService} from '../../services';

const FormArea = ({navigation, route}) => {
  console.log('in form work area page');
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState(null);
  const [picture, setPicture] = useState(null);
  const workArea = route.params.workArea;

  const options = {
    title: 'Take Photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    noData: true,
    storageOptions: {
      skipBackup: true,
    },
  };

  const store_work_area = () => {
    setLoading(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
      .then(location => {
        process_store_work_area(location.longitude, location.latitude);
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
        if (code == 'CANCELLED') {
          Alert.alert('Location cancelled by user or by another request');
        }
        if (code == 'UNAVAILABLE') {
          Alert.alert(
            'Attention',
            'Location service is disabled or unavailable, please turn on your gps for use this apps',
          );
        }
        if (code == 'TIMEOUT') {
          process_store_work_area(0, 0);
        }
        if (code == 'UNAUTHORIZED') {
          Alert.alert('Authorization denied');
        }
        setLoading(false);
      });
  };

  const process_store_work_area = async (longitude, latitude) => {
    try {
      let uploadData = new FormData();
      uploadData.append('userPhotos', {
        type: 'image/jpeg',
        uri: picture.uri,
        name: picture.uri.substring(picture.uri.lastIndexOf('/') + 1),
      });
      uploadData.append('workArea', workArea);
      uploadData.append('username', LoginReducer.form.profile.uid);
      uploadData.append('longitude', longitude);
      uploadData.append('latitude', latitude);
      console.log(uploadData);
      const res = await WorkAreaAPIService.submitWorkArea(uploadData);
      if (res.data.code == 300) {
        setLoading(false);
        Alert.alert('Alert', res.data.message, [
          {
            text: 'Ok',
            onPress: () => navigation.replace('AdminDashboard'),
            style: 'default',
          },
        ]);
      } else {
        setLoading(false);
        console.log(res.data.code, 'store work area succesfully');
        sendNotificationOneSignal(
          'Presence User :',
          LoginReducer.form.profile.name + ' now available in ' + res.data.area,
          res.data.player_ids,
        );
        navigation.replace('AdminDashboard');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handleTakePicture = () => {
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('cancel take picture');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else if (response.error) {
        console.log('LaunchCamera Error: ', response.error);
      } else {
        ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 90)
          .then(response => {
            const source = {uri: response.uri};
            setFileList(source);
            setPicture(response);
          })
          .catch(err => {
            console.log(err);
            return Alert.alert(
              'Unable to resize the photo',
              'Please try again!',
            );
          });
      }
    });
  };

  const handleSubmitPhoto = async () => {
    if (picture == null) {
      Alert.alert('Error', 'Please take a photo for submit work area');
    } else {
      store_work_area();
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={loading}
        textContent={'Process check in, \n please wait for several minutes'}
        textStyle={{color: '#FFF', textAlign: 'center'}}
      />
      <TopHeader
        title="Capture Photo"
        onPress={() => navigation.replace('WorkArea')}
        onPressHome={() => navigation.goBack()}
      />
      <View style={global_style.sub_page}>
        <View
          style={
            (global_style.content_center,
            {flex: 1, justifyContent: 'center', alignItems: 'center'})
          }>
          <Image
            source={fileList == null ? avatar : {uri: fileList.uri}}
            style={{
              width: 250,
              height: 350,
              marginBottom: 30,
              borderColor: colorLogo.color4,
              borderWidth: 1,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: colorLogo.color2,
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              handleTakePicture();
            }}>
            <Text style={{color: 'white'}}>
              <Icon active name="camera-sharp" color="white" size={16} /> Take
              Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colorLogo.color4,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => handleSubmitPhoto()}>
            <Text style={{color: 'white'}}>
              <Icon
                active
                name="ios-location-outline"
                color="white"
                size={16}
              />{' '}
              Check in to work area
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FormArea;
