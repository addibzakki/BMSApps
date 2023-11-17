import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Text
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputDropdownForm,
  InputForm,
  TopHeader,
} from '../../component';
import {colorLogo} from '../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import { ActionButton, ActionButtonAttachment } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import { InputCurrency } from '../../component/atoms/Input';
import Icon from 'react-native-vector-icons/Ionicons';

const PettyRequest = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [entityProject, setEntityProject] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [valueLocation, setValueLocation] = useState(null);
  const [openLocation, setOpenLocation] = useState(false);
  const [listLocation, setListLocation] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [limit, setLimit] = useState(0);

  console.log(LoginReducer.form.profile.uid);

  const handleNext = () => {

    if(valueLocation == null){
      Alert.alert('Attention', 'Please select location');
    }else if (amount.replace(',', '') == '' || amount.replace(',', '') == '0') {
      Alert.alert('Attention', 'Please fill amount value');
    } else if (parseInt(amount.replace(',', '')) > parseInt(limit)) {
      Alert.alert('Attention', 'Insufficient amount, your limit request is ' + limit);
    } else if (description == '') {
      Alert.alert('Attention', 'Please fill description value');
    } else if (fileList.length == 0) {
      Alert.alert('Attention', 'Please take a picture document');
    } else {
      Alert.alert(
        'Attention',
        'Are you sure to submit this request?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => processReading(true) },
        ],
      );
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const getData = async () => {
    try {
      const resp = await PettyLAPIService.getLocation({
        spv: LoginReducer.form.profile.uid,
      });
      setListLocation([...resp.data.location]);
    } catch (error) {
      console.log(error);
    }
  };

  const processReading = async () => {
    setLoading(true);
    try {
      let uploadData = new FormData();
      picture.map(resources => {
        uploadData.append('attachment[]', {
          type: 'image/jpeg',
          uri: resources.uri,
          name: resources.uri.substring(resources.uri.lastIndexOf('/') + 1),
        });
      });
      uploadData.append('entity_project', entityProject);
      uploadData.append('project_no', projectNo);
      uploadData.append('username', LoginReducer.form.profile.uid);
      uploadData.append('descs', description);
      uploadData.append('amount', amount);
      uploadData.append('created_by', LoginReducer.form.profile.uid);

      const res = await PettyLAPIService.createRequest(uploadData);
      if (res.data.code == 200) {
        Alert.alert(
          'Success',
          res.data.message,
          [
            { text: 'Ok', onPress: () => navigation.replace('PettyHistoryRequest') },
          ],
        );
        setLoading(false);
      } else {
        Alert.alert('Warning', res.data.message);
        setLoading(false);
      }
    } catch (error) {
      // inputTablesLog(db, data, 'bms_meter_log', 'error connection');
      // console.log(error);
      Alert.alert('Warning', error.message);
      setLoading(false);
    }
  };

  const options = {
    title: 'Select Photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
    },
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

  const handleSetLocation = async itemValue => {
    const index = listLocation.findIndex(val => val.id == itemValue);
    if (index >= 0) {
      const loc = itemValue.split('::');
      setEntityProject(loc[0]);
      setProjectNo(loc[1]);
      const res = await PettyLAPIService.getLimit({
        entity_project: loc[0],
        project_no: loc[1]
      });
      console.log(res.data);
      setLimit(res.data.limit_amount);
    }
  };

  const handleUpload = () => {
    setModalVisible(true);
  };

  const handleOpenFileType = (type) => {
    if (type == 'Camera') {
      ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
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
              var d = new Date();
              var dd =
                ('0' + d.getDate()).slice(-2) +
                '-' +
                ('0' + (d.getMonth() + 1)).slice(-2) +
                '-' +
                d.getFullYear() +
                ' ' +
                d.getHours() +
                ':' +
                (d.getMinutes() < 10 ? '0' : '') +
                d.getMinutes() +
                ':' +
                (d.getSeconds() < 10 ? '0' : '') +
                d.getSeconds();
              var dateNow = dd.toString();
              ImageMarker.markText({
                src: response.uri,
                text: ' \nDate : ' + dateNow,
                position: 'bottomLeft',
                color: '#FFFFFF',
                fontName: 'Arial-BoldItalicMT',
                fontSize: 20,
                scale: 1,
                quality: 100,
              })
                .then(res => {
                  let uri = 'file://' + res;
                  onSelectedImage({ uri: uri });
                  console.log('the path is' + res);
                })
                .catch(err => {
                  console.log(err);
                });
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
    }else{
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
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
              var d = new Date();
              var dd =
                ('0' + d.getDate()).slice(-2) +
                '-' +
                ('0' + (d.getMonth() + 1)).slice(-2) +
                '-' +
                d.getFullYear() +
                ' ' +
                d.getHours() +
                ':' +
                (d.getMinutes() < 10 ? '0' : '') +
                d.getMinutes() +
                ':' +
                (d.getSeconds() < 10 ? '0' : '') +
                d.getSeconds();
              var dateNow = dd.toString();
              ImageMarker.markText({
                src: response.uri,
                text: ' \nDate : ' + dateNow,
                position: 'bottomLeft',
                color: '#FFFFFF',
                fontName: 'Arial-BoldItalicMT',
                fontSize: 20,
                scale: 1,
                quality: 100,
              })
                .then(res => {
                  let uri = 'file://' + res;
                  onSelectedImage({ uri: uri });
                  console.log('the path is' + res);
                })
                .catch(err => {
                  console.log(err);
                });
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
    }
  }

  const handleEmpty = () => {
    console.log('Empty');
  };

  const ButtonAlert = () =>
    Alert.alert('Attention', 'Are you sure to leave this form?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => navigation.navigate('AdminDashboard')},
    ]);

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Submiting Request...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={'Petty Cash'}
        subTitle={'Request For Funds'}
        onPress={() => navigation.replace('PettyHistoryRequest')}
        onPressHome={() => ButtonAlert()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>
        <View
          style={{
            height: '100%',
            marginTop: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              height: '20%',
              marginTop: 'auto',
              backgroundColor: colorLogo.color3,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
              paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                handleOpenFileType('Camera');
              }}
              style={{
                backgroundColor: colorLogo.color5,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text>
                <Icon name="camera-outline" size={16} /> Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                handleOpenFileType('File');
              }}
              style={{
                backgroundColor: colorLogo.color5,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text>
                <Icon name="file-tray-outline" size={16} /> File
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: colorLogo.color1,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text style={{ color: 'white' }}>
                <Icon name="close" size={16} /> Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <InputDropdownForm
              placeholder="Location *"
              searchable={false}
              open={openLocation}
              value={valueLocation}
              items={listLocation}
              setOpen={setOpenLocation}
              setValue={setValueLocation}
              onChangeValue={val => handleSetLocation(val)}
              itemSeparator={true}
            />
            
            <InputCurrency
              placeholder="Amount"
              keyboardType="number-pad"
              onChangeText={value => setAmount(value)}
              amount={amount}
            />
            <InputForm
              placeholder="Description"
              multiline={true}
              onChangeText={value => setDescription(value)}
              value={description}
            />
            <ActionButtonAttachment
              title="Attachment"
              onPress={() => handleUpload()}
              list={fileList}
            />
            <View style={styles.space(15)} />
          </View>
          <View style={styles.space(20)} />
          <ActionButton title="Submit" onPress={() => handleNext()} />
          <View style={styles.space(20)} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: colorLogo.color4,
    },
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
  },
  modal: {
    backgroundColor: 'white',
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default PettyRequest;
