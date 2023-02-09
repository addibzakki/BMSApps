import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {colorButton, colorLogo} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setPVChecklistAttr, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import PreventiveAPIService from '../../../services/Preventive/APIservice';
import {insert_pv_checklist_tmp} from '../../databases/insert/insert_pv_checklist_tmp';
import {addPhoto} from '../../../assets';
import {SelectInline} from '../../atoms/Select/index';
import {InputRichText} from '../../atoms/Input/index';
import {Picker} from '@react-native-picker/picker';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';

export const CheckStandartPreventive = (props, ...rest) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState(null);
  const [picture, setPicture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [captureId, setCaptureId] = useState(null);
  const [text, setText] = useState('');
  const listOption = [
    {id: null, label: '-', enabled: false},
    {id: 13, label: 'Ok', enabled: true},
    {id: 14, label: 'Not Ok', enabled: true},
    {id: 18, label: 'Normal', enabled: true},
  ];
  const [selected, setSelected] = useState('');
  const option = listOption.map(item => {
    return (
      <Picker.Item
        key={item.id}
        label={item.label}
        value={item.id}
        enabled={item.enabled}
      />
    );
  });
  const handleCapture = attr => {
    setFileList(attr.images === null ? null : {uri: attr.images});
    setCaptureId(attr.id);
    setModalVisible(!modalVisible);
  };
  const options = {
    title: 'Take Photo',
    noData: true,
  };
  const handleTakePhoto = () => {
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

  const handleSubmitCheckStandart = item => {
    if (item.required === 1 && selected === '') {
      Alert.alert(
        'Attention!',
        'Task point ' + item.task_name + ' is required',
      );
      return false;
    }
    if (item.image_required === 1 && fileList === null) {
      Alert.alert(
        'Attention!',
        'Image task point ' + item.task_name + ' has been required',
      );
      return false;
    }

    db.transaction(txn => {
      txn.executeSql(
        'UPDATE pv_checkstandart_tmp SET images = ?, remark = ?, status = ?, process = 1 WHERE id = ?',
        [fileList.uri, text, selected, item.id],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            console.log('update check standart successfully');
            dispatch(setRefresh(true));
            setFileList(null);
            setText('');
            setSelected('');
          }
        },
        error => {
          console.log(
            'error on select table pv_checkstandart_tmp ' + error.message,
          );
        },
      );
    });
  };

  const renderItem = ({item, index}) => {
    console.log(item);
    let background_color;
    if (
      item.required == 0 &&
      (item.image_required == 0 || item.video_required == 0)
    ) {
      background_color = colorButton.submit;
    } else if (
      item.required == 1 &&
      item.image_required == 0 &&
      item.video_required == 0
    ) {
      background_color = colorButton.transfer;
    } else {
      background_color = colorButton.cancel;
    }
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar>
        <Left
          style={{
            backgroundColor: background_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Icon
              active
              name="ios-clipboard-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <View style={{flexWrap: 'wrap'}}>
            <TextLineIndentLight label="Point" value={item.task_name} />
            <TextLineIndentLight label="Desc" value={item.task_description} />
            <View
              style={{
                borderWidth: 0.5,
                marginVertical: 5,
                borderColor: background_color,
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap-reverse',
                }}>
                Photo
              </Text>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap-reverse',
                }}>
                :
              </Text>
              <View style={{marginLeft: 3, width: '75%'}}>
                <TouchableOpacity
                  style={{width: '15%', justifyContent: 'center'}}
                  onPress={() => handleTakePhoto()}>
                  <Image
                    source={fileList === null ? addPhoto : {uri: fileList.uri}}
                    style={
                      fileList === null
                        ? {width: 30, height: 30, opacity: 0.3}
                        : styles.solid_image
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap',
                }}>
                <Text>Status</Text>
              </View>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap',
                }}>
                :
              </Text>
              <View
                style={{
                  textAlign: 'justify',
                  width: '75%',
                }}>
                <Picker
                  placeholder="Start Year"
                  mode="dropdown"
                  style={{height: 20}}
                  itemStyle={{fontSize: 8}}
                  selectedValue={selected}
                  onValueChange={item => setSelected(item)}>
                  {option}
                </Picker>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />

          <View>
            <Text
              style={{
                fontSize: 14,
                // letterSpacing: 2,
                textTransform: 'capitalize',
                color: colorLogo.color3,
                marginBottom: 5,
              }}>
              Remarks
            </Text>
            <View style={{marginRight: 5}}>
              <TextInput
                multiline={true}
                value={text}
                onChangeText={val => setText(val)}
                style={{
                  borderWidth: 1,
                  marginRight: 10,
                  fontSize: 12,
                  textAlignVertical: 'top',
                  borderRadius: 10,
                  padding: 10,
                  borderColor: colorLogo.color5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: background_color,
            }}
          />
          <TouchableOpacity
            style={{
              marginRight: 15,
              marginTop: 5,
              borderRadius: 10,
              alignItems: 'center',
              paddingVertical: 5,
              backgroundColor: colorButton.submit,
            }}
            onPress={() => handleSubmitCheckStandart(item)}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </Body>
      </ListItem>
    );
  };

  return (
    <View>
      <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        {...rest}
      />
    </View>
  );
};

const styles = {
  blur_image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    opacity: 0.2,
    marginBottom: 30,
    borderColor: colorLogo.color4,
    // borderWidth: 1,
    borderRadius: 10,
  },
  solid_image: {
    width: 170,
    height: 230,
    resizeMode: 'contain',
    // opacity: {},
    borderColor: colorLogo.color4,
    // borderWidth: 1,
    // borderRadius: 10,
  },
};
