import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import {ListImage, TopHeader} from '../../../../component';
import {global_style} from '../../../../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {colorLogo} from '../../../../utils';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../../redux';
import {PreventiveAPIService} from '../../../../services';

const AdminPreventifPhotoBefore = ({navigation}) => {
  console.log('In page take photo before');
  const dispatch = useDispatch();
  const PreventifReducer = useSelector(state => state.PreventifReducer);

  const LoginReducer = useSelector(state => state.LoginReducer);

  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [loading, setLoading] = useState(false);

  const options = {
    title: 'Take Photo',
    noData: true,
  };

  const handleTakePicture = () => {
    if (fileList.concat(PreventifReducer.checklist.images_before).length < 3) {
      ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 90)
            .then(response => {
              onSelectedImage(response);
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
    } else {
      Alert.alert(
        'Attention',
        'Sorry, to capture photos a maximum of only 3 times',
      );
    }
  };

  const onSelectedImage = image => {
    let newDataImg = fileList;
    const source = {uri: image.uri};
    let item = {
      url: source,
    };
    newDataImg.push(item);
    let joined = picture.concat(image);
    setFileList(newDataImg);
    setPicture(joined);
  };

  const handleSubmitPhotoBefore = async () => {
    try {
      if (picture.length > 0) {
        setLoading(true);
        let uploadData = new FormData();
        picture.map(resources => {
          uploadData.append('images[]', {
            type: 'image/jpeg',
            uri: resources.uri,
            name: resources.uri.substring(resources.uri.lastIndexOf('/') + 1),
          });
        });
        uploadData.append('status', 2);
        const params = [PreventifReducer.checklist.id, uploadData];

        const res = await PreventiveAPIService.submitPhotoBeforePreventif(
          params,
        );
        if (res.data.code === 422) {
          Alert.alert('Error', res.data.message.status[0]);
          setLoading(false);
        } else {
          dispatch(setRefresh(true));
          setLoading(false);
          navigation.navigate('AdminPreventifListChecklist');
        }
      } else {
        navigation.navigate('AdminPreventifListChecklist');
      }
    } catch (error) {
      setLoading(false);
      console.warn(error.message);
    }
  };

  const handleCancel = () => {
    if (LoginReducer.form.profile.level === 'Supervisor') {
      navigation.navigate('AdminPreventiveDashboard');
    } else {
      navigation.navigate('AdminPICPreventifDashboard');
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={loading}
        textContent={'Submit photo before...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title="Preventive"
        subTitle="Take Photo Before Condition"
        onPress={() => {
          if (LoginReducer.form.profile.level === 'Supervisor') {
            navigation.navigate('AdminPreventiveDashboard');
          } else {
            navigation.navigate('AdminPICPreventifDashboard');
          }
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={global_style.sub_page}>
        <ListImage
          list={fileList}
          listExists={PreventifReducer.checklist.images_before}
          style={{justifyContent: 'center'}}
        />
        <View style={global_style.content_center}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
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
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 10,
              bottom: 30,
              position: 'absolute',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colorLogo.color4,
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                marginHorizontal: 10,
              }}
              onPress={() => {
                handleSubmitPhotoBefore();
              }}>
              <Text style={{color: 'white'}}>
                <Icon active name="checkmark-sharp" color="white" size={16} />{' '}
                Go To Task
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colorLogo.color1,
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                marginHorizontal: 10,
              }}
              onPress={() => {
                handleCancel();
              }}>
              <Text style={{color: 'white'}}>
                <Icon
                  active
                  name="close-circle-sharp"
                  color="white"
                  size={16}
                />{' '}
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifPhotoBefore;
