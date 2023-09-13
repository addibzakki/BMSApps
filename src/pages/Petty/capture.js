import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputForm,
  InputRichText,
  TopHeader,
  uploadTables,
} from '../../component';
import {colorLogo} from '../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import {Icon} from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import BackgroundJob from 'react-native-background-job';
import { ActionButton, ActionButtonAttachment } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';

const PettyCapture = ({route, navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [signature, setSign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  console.log(LoginReducer.form.profile.uid);

  const handleNext = () => {
    console.log(amount, route.params.header.current_amount);
    if (amount == '' || amount == '0') {
      Alert.alert('Attention', 'Please fill amount value');
    } else if (parseInt(amount) > parseInt(route.params.header.current_amount)) {
      Alert.alert('Attention', 'Insufficient amount');
    } else if (description == '') {
      Alert.alert('Attention', 'Please fill description value');
    } else if (fileList.length == 0) {
      Alert.alert('Error', 'Please take a picture document');
    } else {
      Alert.alert(
        'Attention',
        'Are you sure to submit this settlement?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => processReading(true)},
        ],
      );
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
      uploadData.append('transaction_id', route.params.header.id);
      uploadData.append('entity_project', route.params.header.entity_project);
      uploadData.append('project_no', route.params.header.project_no);
      uploadData.append('bank_cd', route.params.header.bank_cd);
      uploadData.append('doc_no', route.params.header.doc_no);
      uploadData.append('amount', amount);
      uploadData.append('descs', description);
      uploadData.append('created_by', LoginReducer.form.profile.uid);
      console.log(uploadData);

      const res = await PettyLAPIService.createTransaction(uploadData);
      if (res.data.code == 200) {
        Alert.alert(
          'Success',
          res.data.message,
          [
            { text: 'Ok', onPress: () => navigation.replace('PettyDetail', route.params) },
          ],
        );
        setLoading(false);
      } else {
        Alert.alert('Error', res.data.message);
        setLoading(false);
      }
    } catch (error) {
      // inputTablesLog(db, data, 'bms_meter_log', 'error connection');
      // console.log(error);
      Alert.alert('Error', error.message);
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
              text: MeterReducer.meterInfo.ref_no + ' \nDate : ' + dateNow,
              position: 'bottomLeft',
              color: '#FFFFFF',
              fontName: 'Arial-BoldItalicMT',
              fontSize: 20,
              scale: 1,
              quality: 100,
            })
              .then(res => {
                let uri = 'file://' + res;
                onSelectedImage({uri: uri});
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
        textContent={'Submiting Capture Settlement...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={'Capture Settlement'}
        subTitle={'#' + route.params.doc_no}
        onPress={() => navigation.replace('PettyDetail', route.params)}
        onPressHome={() => ButtonAlert()}
      />
      
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <InputForm
              placeholder="Amount"
              keyboardType="number-pad"
              onChangeText={value => setAmount(value)}
              value={amount}
            />
            <InputForm
              placeholder="Description"
              multiline={true}
              onChangeText={value => setDescription(value)}
              value={description}
            />
            <ActionButtonAttachment
              title="Photo"
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

export default PettyCapture;
