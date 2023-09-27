import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputForm,
  TopHeader,
  uploadTablesMaster,
} from '../../../component';
import {colorLogo} from '../../../utils';
import {ActionButton} from '../ActionButton';
import Spinner from 'react-native-loading-spinner-overlay';
import BackgroundJob from 'react-native-background-job';

const AdminMeterWritingMaster = ({navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [heightVal, setHeightVal] = useState(0);
  const [volume, setVolume] = useState(0);
  const [loading, setLoading] = useState(false);


  BackgroundJob.register({
    jobKey: MeterReducer.meterID,
    job: () => {
      uploadTablesMaster(db, [
        MeterReducer.meterInfo.meter_cd,
        MeterReducer.meterInfo.entity_cd,
        MeterReducer.meterInfo.project_no,
      ]);
      console.log('Background Job fired for : ' + MeterReducer.meterInfo.meter_cd);
    },
  });

  const processReading = () => {
    console.log('input into local database');
    var d = new Date();
    var dd =
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2);
    var dateNow = dd.toString();
    var months = ('0' + (d.getMonth() + 1)).slice(-2);
    var years = d.getFullYear();


    db.transaction(txn => {
      txn.executeSql(
        'INSERT OR IGNORE INTO bms_volume_trx_temp (entity_cd, db_identity, project_no, meter_cd, month, year, status, shape, length, diameter, width, height, volume, clean_water_rate, dirty_water_rate, dirty_water_usage, read_by, read_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          MeterReducer.meterInfo.entity_cd,
          MeterReducer.meterInfo.db_identity,
          MeterReducer.meterInfo.project_no,
          MeterReducer.meterInfo.meter_cd,
          months,
          years,
          '1',
          MeterReducer.meterInfo.shape,
          MeterReducer.meterInfo.length,
          MeterReducer.meterInfo.diameter,
          MeterReducer.meterInfo.width,
          heightVal,
          volume,
          MeterReducer.meterInfo.clean_water_rate,
          MeterReducer.meterInfo.dirty_water_rate,
          MeterReducer.meterInfo.dirty_water_usage,
          LoginReducer.form.profile.uid,
          dateNow,
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
          console.log('insert table bms_volume_trx_temp successfully');
          setLoading(false);
          navigation.replace('AdminMeter');
        },
        error => {
          console.log('error on insert table bms_volume_trx_temp ' + error.message);
          Alert.alert('error', 'Submit meter transaction volume recording failed');
          setLoading(false);
        },
      );
    });
  };


  const handleNext = () => {
    console.log(heightVal);
    if (heightVal.trim() == '' || heightVal == '0' || heightVal == '0.00') {
      Alert.alert('Warning', 'Please fill height value');  
    } else {
      Alert.alert(
        'Attention',
        'Are you sure to submit this reading?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => processReading() },
        ],
      );
    }
  };

  const ButtonAlert = () => {
    Alert.alert('Attention', 'Are you sure to leave this form?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => navigation.navigate('AdminDashboard')},
    ]);
  }


  const calculateVolume = (height) => {
    let tank = ['GWT','Roof Tank'];
    setHeightVal(height);
    if (tank.includes(MeterReducer.meterInfo.shape)) {
      // TODO : rumus GWT dan Rooftank
      let length = MeterReducer.meterInfo.length;
      let width = MeterReducer.meterInfo.width;
      setVolume((length * width * height).toFixed(2));
    } else {
      // TODO : rumus toren
      let diameter = MeterReducer.meterInfo.diameter;
      setVolume(((3.14 * ((diameter / 2) * (diameter / 2))) * height).toFixed(2));
    }
  }

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Submit ' + MeterReducer.meterInfo.shape +' height & volume...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={MeterReducer.meterInfo.meter_cd}
        subTitle={MeterReducer.meterInfo.shape}
        onPress={() => navigation.replace('AdminMeter')}
        onPressHome={() => ButtonAlert()}
      />
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <View>
                <InputForm
                  placeholder="Height"
                  keyboardType="number-pad"
                value={heightVal}
                  onChangeText={value => calculateVolume(value)}
                />
                <InputForm
                  placeholder="Volume"
                  value={volume.toString()}
                  editable={false}
                />
            </View>
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

export default AdminMeterWritingMaster;
