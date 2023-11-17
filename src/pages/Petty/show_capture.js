import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputForm,
  ListAttachment,
  TopHeader,
} from '../../component';
import {colorLogo} from '../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import { ActionButton, ActionButtonAttachment, ActionButtonAttachmentMultipleShow } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import { ListItem, CheckBox, Body } from 'native-base';

const PettyShowCapture = ({route, navigation}) => {
  console.log('in page show capture');
  console.log(route.params);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [initialKM, setInitialKM] = useState(route.params.km_awal);
  const [finalKM, setFinalKM] = useState(route.params.km_akhir);
  const [description, setDescription] = useState('');
  const [fileList, setFileList] = useState([]);
  const [fileListExist, setFileListExist] = useState([]);
  const [picture, setPicture] = useState([]);
  const [isChecked, setIsChecked] = useState((route.params.is_balance == 'N'? false:true));



  const options = {
    title: 'Select Photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
    },
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const chkbox_check = () => {
    if (isChecked == true) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  };

  const getData = async () => {
    try {
      const res = await PettyLAPIService.getDetailByID(
        route.params.id,
      );
      res.data.data.attachment_file.map(resources => {
        const source = {
          uri: resources,
        };
        let item = {
          url: source,
        };
        fileListExist.push(item);
      });
      setFileListExist(fileListExist);
      setAmount(res.data.data.amount);
      setDescription(res.data.data.descs);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpload = () => {
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
              text: 'Date : ' + dateNow,
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
  };

  const handleNext = (action) => {
    if (amount == '' || amount == '0') {
      Alert.alert('Attention', 'Please fill amount value');
    } else if (description == '') {
      Alert.alert('Attention', 'Please fill description value');
    } else {
      Alert.alert(
        'Attention',
        'Are you sure to modify this request?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => processModify(true) },
        ],
      );
    }
  };

  const onSelectedImage = image => {
    let newDataImg = fileList;
    const source = { uri: image.uri };
    let item = {
      url: source,
    };
    newDataImg.push(item);
    let joined = picture.concat(image);
    setFileList(newDataImg);
    setPicture(joined);
  };

  const processModify = async () => {
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
      uploadData.append('id', route.params.id);
      uploadData.append('entity_project', route.params.entity_project);
      uploadData.append('project_no', route.params.project_no);
      uploadData.append('descs', description);
      uploadData.append('is_balance', isChecked);
      uploadData.append('id_category', route.params.data.id_category);
      uploadData.append('updated_by', LoginReducer.form.profile.uid);
      uploadData.append('km_awal', ((route.params.data.category_desc == 'Transport' && isChecked == false) ? initialKM : 0));
      uploadData.append('km_akhir', ((route.params.data.category_desc == 'Transport' && isChecked == false) ? finalKM : 0));


      const res = await PettyLAPIService.modifyTransaction(uploadData);
      if (res.data.code == 200) {
        Alert.alert(
          'Success',
          res.data.message,
          [
            { text: 'Ok', onPress: () => navigation.replace('PettyDetail', route.params.data) },
          ],
        );
        setLoading(false);
      } else {
        Alert.alert('Error', res.data.message);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
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
        textContent={'Submiting Capture Settlement...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={'Capture Settlement'}
        subTitle={'#' + route.params.doc_no}
        onPress={() => navigation.replace('PettyDetail', route.params.data)}
        onPressHome={() => ButtonAlert()}
      />
      
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <InputForm
              placeholder="Amount"
              keyboardType="number-pad"
              value={route.params.amount}
              // editable={route.params.data.status == 'R' || route.params.data.status == 'S' ? true : false}
              editable={false}
            />
            {
              (route.params.data.status_settle == 'P' || route.params.data.status_settle == null) ? (<ListItem style={{ paddingTop: 0, paddingBottom: 10, paddingLeft: 0, paddingRight: 0, marginLeft: 0 }} noBorder>
                <CheckBox
                  onPress={() => chkbox_check()}
                  checked={isChecked}
                  style={{
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                  disabled={(route.params.is_balance == 'N' ? false : true)}
                />
                <Body>
                  <Text
                    style={{
                      fontSize: 14,
                      // letterSpacing: 2,
                      textTransform: 'capitalize',
                      fontWeight: 'bold',
                      color: colorLogo.color3,
                    }}>
                    Refund?
                  </Text>
                </Body>
              </ListItem>) : (route.params.is_balance == 'Y' && (<InputForm
                placeholder="Type"
                multiline={true}
                value={'Refund'}
                editable={false}
              />))
                
            }
            {
              (route.params.data.category_desc == 'Transport' && isChecked == false) && (
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '49%' }}>
                    <InputForm
                      placeholder="Initial KM"
                      keyboardType="number-pad"
                      value={initialKM}
                      onChangeText={value => setInitialKM(value)}
                    />
                  </View>
                  <View style={{ width: '2%' }} />
                  <View style={{ width: '49%' }}>
                    <InputForm
                      placeholder="Final KM"
                      keyboardType="number-pad"
                      value={finalKM}
                      onChangeText={value => setFinalKM(value)}
                    />
                  </View>
                </View>
              ) 
            }
            <InputForm
              placeholder="Description"
              multiline={true}
              value={description}
              onChangeText={value => setDescription(value)}
              editable={route.params.data.status == 'S' || route.params.data.status_settle == 'P' || route.params.data.status_settle == null ? true : false}
            />
            {/* <ListAttachment list={fileList} /> */}
            <ActionButtonAttachment
              title="Attachment"
              onPress={() => handleUpload()}
              list={fileList}
              fileExists={fileListExist}
              show={route.params.data.status == 'S' || route.params.data.status_settle == 'P' || route.params.data.status_settle == null ? true : false}
            />
            <View style={styles.space(15)} />
          </View>
          {
            (route.params.data.status_settle == 'P' || route.params.data.status_settle == null) && (<ActionButton title="Modify" onPress={() => handleNext('modify')} />)
          }
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

export default PettyShowCapture;
