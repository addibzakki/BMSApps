import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
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
import {Body, CheckBox, Icon, ListItem} from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import BackgroundJob from 'react-native-background-job';
import { ActionButton, ActionButtonAttachment } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { InputCurrency } from '../../component/atoms/Input';

const PettyCapture = ({route, navigation}) => {
  console.log('On page Capture');
  console.log(route.params);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [amount, setAmount] = useState('');
  const [initialKM, setInitialKM] = useState('');
  const [finalKM, setFinalKM] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [isChecked, setIsChecked] = useState(false);


  const handleNext = () => {
    if (amount.replace(',', '') == '' || amount.replace(',', '') == '0') {
      Alert.alert('Attention', 'Please fill amount value');
    } else if (parseInt(amount.replace(',', '')) > parseInt(route.params.header.current_amount)) {
      Alert.alert('Attention', 'Insufficient amount, your remaining balance is ' + route.params.header.current_amount_format);
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
      uploadData.append('id_category', route.params.header.id_category);
      uploadData.append('id_admin', (route.params.header.id_admin == null ? 0 : route.params.header.id_admin));
      uploadData.append('username_fm', (route.params.header.username_fm == null ? 0 : route.params.header.username_fm));
      uploadData.append('km_awal', ((route.params.data.category_desc == 'Transport' && isChecked == false) ? initialKM:0));
      uploadData.append('km_akhir', ((route.params.data.category_desc == 'Transport' && isChecked == false) ? finalKM:0));
      uploadData.append('project_no', route.params.header.project_no);
      uploadData.append('doc_no', route.params.header.doc_no);
      uploadData.append('amount', amount);
      uploadData.append('descs', description);
      uploadData.append('is_balance', isChecked);
      uploadData.append('created_by', LoginReducer.form.profile.uid);

      console.log(uploadData);

      const res = await PettyLAPIService.createTransaction(uploadData);
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

  const chkbox_check = () => {
    // if (networkContext.networkInfo == false) {
    //   Alert.alert(
    //     'Attention',
    //     'Sorry, please use a good network to access this feature',
    //   );
    // } else {
      if (isChecked == true) {
        setIsChecked(false);
      } else {
        setIsChecked(true);
      }
    // }
  };

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
            <InputCurrency
              placeholder="Amount"
              keyboardType="number-pad"
              onChangeText={value => setAmount(value)}
              amount={amount}
            />
            <ListItem style={{ paddingTop: 0, paddingBottom: 10, paddingLeft: 0, paddingRight: 0, marginLeft: 0 }} noBorder>
              <CheckBox
                onPress={() => chkbox_check()}
                checked={isChecked}
                style={{
                  marginTop: 0,
                  paddingTop: 0,
                }}
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
            </ListItem>
            {
              (route.params.data.category_desc == 'Transport' && isChecked == false) && (
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '49%'}}>
                    <InputForm
                      placeholder="Initial KM"
                      keyboardType="number-pad"
                      value={initialKM}
                      onChangeText={value => setInitialKM(value)}
                    />
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '49%'}}>
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
