import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputForm,
  InputFormSignature,
  TopHeader,
  uploadTables,
} from '../../../component';
import {colorLogo} from '../../../utils';
import {ActionButton} from '../ActionButton';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import {ActionButtonAttachment} from '../ActionButton';
import Signature from 'react-native-signature-canvas';
import {Icon} from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import BackgroundJob from 'react-native-background-job';

const AdminMeterWriting = ({navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [currRead, setCurrRead] = useState('');
  const [currReadHigh, setCurrReadHigh] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [signature, setSign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  BackgroundJob.register({
    jobKey: MeterReducer.meterID,
    job: () => {
      uploadTables(db, [
        MeterReducer.meterID,
        MeterReducer.meterInfo.entity_cd,
      ]);
      console.log('Background Job fired for : ' + MeterReducer.meterID);
    },
  });

  const handleNext = () => {
    if (currRead != '' || currReadHigh != '') {
      if (currRead != '0') {
        if (
          MeterReducer.lastReading.last_read <= currRead &&
          MeterReducer.lastReading.last_read_high <= currReadHigh
        ) {
          if (picture.length == 0 || fileList.length == 0) {
            Alert.alert('Error', 'Please take a picture meter reading');
          } else if (signature == null || tenantName == '') {
            Alert.alert(
              'Attention',
              'Are you sure to submit this meter reading without pic & signature tenant?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Yes', onPress: () => processReading(false)},
              ],
            );
          } else {
            Alert.alert(
              'Attention',
              'Are you sure to submit this meter reading?',
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
        } else {
          Alert.alert(
            'Warning',
            'Value previous read (' +
              MeterReducer.lastReading.last_read +
              ') / read high (' +
              MeterReducer.lastReading.last_read_high +
              ') must greater than current reading',
          );
        }
      } else {
        Alert.alert('Warning', 'Please fill current read value');
      }
    } else {
      if (currRead == '') {
        Alert.alert('Warning', 'Please fill current read value');
      } else if (currReadHigh == '') {
        Alert.alert('Warning', 'Please fill current read high value');
      }
    }
  };

  const processReading = available => {
    console.log('input into local database');
    var d = new Date();
    var dd =
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2);
    var dateNow = dd.toString();

    let store = [];
    picture.map(res => {
      store.push(res.uri);
    });
    db.transaction(txn => {
      txn.executeSql(
        'INSERT OR IGNORE INTO bms_meter_temp (entity_cd, project_no, debtor_acct, lot_no, debtor_name, meter_id, curr_read_date, curr_read, curr_read_high, attachment, tenant_name, signature, read_by, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          MeterReducer.meterInfo.entity_cd,
          MeterReducer.meterInfo.project_no,
          MeterReducer.meterInfo.debtor_acct,
          MeterReducer.meterInfo.lot_no,
          MeterReducer.info.tenant_name,
          MeterReducer.meterID,
          dateNow,
          currRead,
          currReadHigh,
          store.join(';;'),
          tenantName,
          signature,
          LoginReducer.form.profile.uid,
          available == false ? 0 : 1,
        ],
        (txn, res) => {
          BackgroundJob.schedule({
            period: 10000,
            allowExecutionInForeground: true,
            exact: true,
            networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
            notificationText:
              'Process post meter ' +
              MeterReducer.meterID +
              ' running in background',
            notificationTitle: 'Building Management System',
            jobKey: MeterReducer.meterID,
          });
          console.log('insert table bms_meter successfully');
          setLoading(false);
          navigation.replace('AdminMeter');
        },
        error => {
          console.log('error on insert table bms_meter ' + error.message);
          Alert.alert('error', 'Submit meter recording failed');
          setLoading(false);
        },
      );
    });
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

  const handleSignature = signature => {
    setSign(signature);
    setModalVisible(false);
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

  const style = `.m-signature-pad--footer
        .button {
          background-color: red;
          color: #FFF;
        }`;

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Submiting Reading Meter...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={MeterReducer.meterInfo.meter_id}
        subTitle={MeterReducer.info.tenant_name}
        onPress={() => navigation.replace('AdminMeter')}
        onPressHome={() => ButtonAlert()}
      />
      <Modal
        style={styles.modal}
        animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{
                margin: 10,
                padding: 10,
                borderRadius: 10,
                backgroundColor: colorLogo.color1,
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'white'}}>
                <Icon
                  type="FontAwesome"
                  active
                  name="times"
                  style={{fontSize: 14, color: 'white'}}
                />{' '}
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <Signature
            onOK={handleSignature}
            onEmpty={handleEmpty}
            descriptionText="Signature"
            clearText="Clear"
            confirmText="Save"
            minWidth={5}
            webStyle={style}
          />
        </View>
      </Modal>
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '49%'}}>
                <InputForm
                  placeholder="Current Read"
                  keyboardType="number-pad"
                  // value={currRead}
                  value={
                    MeterReducer.lastReading.last_read == 0
                      ? MeterReducer.lastReading.last_read.toString()
                      : currRead
                  }
                  editable={
                    MeterReducer.lastReading.last_read == 0 ? false : true
                  }
                  onChangeText={value => setCurrRead(value)}
                />
              </View>
              <View style={{width: '2%'}} />
              <View style={{width: '49%'}}>
                <InputForm
                  placeholder="Current Read High"
                  keyboardType="number-pad"
                  value={
                    MeterReducer.lastReading.last_read_high == 0
                      ? MeterReducer.lastReading.last_read_high.toString()
                      : currReadHigh
                  }
                  editable={
                    MeterReducer.lastReading.last_read_high == 0 ? false : true
                  }
                  onChangeText={value => setCurrReadHigh(value)}
                />
              </View>
            </View>
            <View style={styles.space(15)} />
            <ActionButtonAttachment
              title="Photo"
              onPress={() => handleUpload()}
              list={fileList}
            />
            <View style={styles.space(15)} />
            <InputForm
              placeholder="Tenant PIC"
              value={tenantName}
              onChangeText={value => setTenantName(value)}
            />
            <View style={styles.space(15)} />
            <InputFormSignature
              title="Signature"
              signature={signature}
              onPress={() => setModalVisible(true)}
              icon="file-signature"
            />
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

export default AdminMeterWriting;
