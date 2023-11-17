import React, {useState, useContext} from 'react';
import {Dimensions, View, Text, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useDispatch} from 'react-redux';
import {
  setInfoMeterID,
  setInfoMeter,
  setInfoTenant,
  setLastReadingMeter,
} from '../Action';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import GlobalContext from '../../../component/GlobalContext';
import {MeterAPIService} from '../../../services';

const heightScreen = Dimensions.get('window').height;
const AdminMeterBarcode = ({navigation}) => {
  const networkContext = useContext(GlobalContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const MeterReducer = useSelector(state => state.MeterReducer);

  let scanner;

  const startScan = () => {
    if (scanner) {
      scanner._setScanning(false);
    }
  };

  const backToDashboard = () => {
    navigation.replace('AdminMeterReading');
  };

  const ButtonAlert = (nextConfirm, message) => {
    if (nextConfirm == true) {
      Alert.alert('Attention', message, [
        {
          text: 'No',
          onPress: () => backToDashboard(),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => startScan()},
      ]);
    } else {
      Alert.alert('Attention', message, [
        {
          text: 'No',
          onPress: () => navigation.replace('AdminMeter'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => startScan()},
      ]);
    }
  };

  const onBarCodeRead = scanResult => {
    handleCekMeterID(scanResult.data);
  };

  const handleCekMeterID = async value => {
    if (networkContext.networkInfo == true) {
      try {
        setLoading(true);
        const meterSplit = value.split('::');
        if (meterSplit[0].includes('MST-')){
          const res = await MeterAPIService.getMeterMaster(value);
          if (res.data.validation == 'valid') {
            setLoading(false);
            dispatch(setInfoMeterID(res.data.meterInfo.meter_cd));
            dispatch(setInfoMeter(res.data.meterInfo));

            navigation.replace('AdminMeterWritingMaster');
          } else {
            setLoading(false);
            ButtonAlert(true, res.data.message);
          }
        } else {
          const res = await MeterAPIService.getMeter(value);
          
          if (res.data.validation == 'valid') {
            setLoading(false);
            dispatch(setInfoMeterID(value));
            dispatch(setInfoMeter(res.data.meterInfo));
            dispatch(setInfoTenant(res.data.tenantInfo));
            dispatch(setLastReadingMeter(res.data.lastread));
            var meter_type = ['water-induk','gardu-induk'];
            if (meter_type.includes(res.data.meterInfo.meter_id) && res.data.type == 'update') {
              navigation.replace('AdminMeterWritingUpdate');
            }else{
              navigation.replace('AdminMeterWriting');
            }
          } else if (res.data.validation == 'duplicate') {
            ButtonAlert(false, res.data.message);
            setLoading(false);
            startScan();
          } else {
            setLoading(false);
            ButtonAlert(true, res.data.message);
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    } else {
      setLoading(true);
      var meterSplit = value.split('::');
      var gardu = ['gardu-induk','water-induk']
      if (gardu.includes(meterSplit[0])) {
        value = meterSplit[0].concat('::', meterSplit[1], '::', meterSplit[2]);
      }
      var temp = [];
      db.transaction(txn => {
        txn.executeSql(
          "SELECT * FROM bms_meter WHERE (meter_id = ? OR meter_id ||'::'|| entity_cd = ? OR meter_id ||'::'|| entity_cd ||'::'|| project_no = ?) LIMIT 1",
          [value, value, value],
          (txn, res) => {
            console.log(res, 'bms_meter');
            if (res.rows.length > 0) {
              ButtonAlert(
                false,
                'Sorry, meter recording has been done by ' +
                  res.rows.item(0).read_by +
                  ' on the date ' +
                  res.rows.item(0).curr_read_date +
                  ', would you like to rescan?',
              );
            } else {
              txn.executeSql(
                "SELECT * FROM list_meter WHERE (meter_id = ? OR meter_id ||'::'|| entity_cd = ?) ORDER BY read_date DESC LIMIT 1",
                [value, value],
                (txn, res) => {
                  console.log(res, 'list_meter');
                  if (res.rows.length == 0) {
                    setLoading(false);
                    ButtonAlert(
                      true,
                      "Sorry, the barcode doesn't match, re-scan?",
                    );
                  } else {
                    setLoading(false);
                    dispatch(
                      setLastReadingMeter({
                        last_read_date: res.rows.item(0).read_date,
                        last_read: res.rows.item(0).last_read,
                        last_read_high: res.rows.item(0).last_read_high,
                      }),
                    );
                    dispatch(setInfoMeterID(value));
                    dispatch(
                      setInfoMeter({
                        debtor_acct: res.rows.item(0).debtor_acct,
                        meter_id: res.rows.item(0).meter_id,
                        entity_cd: res.rows.item(0).entity_cd,
                        lot_no: res.rows.item(0).lot_no,
                        project_no: res.rows.item(0).project_no,
                        ref_no: res.rows.item(0).ref_no,
                        category_cd: res.rows.item(0).category_cd,
                      }),
                    );
                    dispatch(
                      setInfoTenant({
                        tenant_code: res.rows.item(0).business_id,
                        tenant_name: res.rows.item(0).debtor_name,
                      }),
                    );

                    var meter_type = ['water-induk', 'gardu-induk'];
                    if (meter_type.includes(res.rows.item(0).meter_id)) {
                      navigation.replace('AdminMeterWritingUpdate');
                    } else {
                      navigation.replace('AdminMeterWriting');
                    }
                  }
                  // setFlatListItems(temp);
                  setLoading(false);
                },
                error => {
                  console.log(
                    'error on select table list_meter ' + error.message,
                  );
                  setLoading(false);
                },
              );
            }
            setLoading(false);
          },
          error => {
            console.log('error on select table list_meter ' + error.message);
            setLoading(false);
          },
        );
      });
    }
  };

  return (
    <View>
      <Spinner
        visible={loading}
        textContent={'Checking barcode...'}
        textStyle={{color: '#FFF'}}
      />
      <QRCodeScanner
        ref={camera => (scanner = camera)}
        reactivate={true}
        reactivateTimeout={5000}
        onRead={onBarCodeRead}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        topViewStyle={{flex: -1}}
        customMarker={
          <BarcodeMask
            width={300}
            height={300}
            showAnimatedLine={true}
            outerMaskOpacity={0.8}
          />
        }
        cameraStyle={{height: heightScreen}}
      />
    </View>
  );
};

export default AdminMeterBarcode;
