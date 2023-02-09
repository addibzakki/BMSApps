import React, {useState} from 'react';
import {Dimensions, View, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {WorkAreaAPIService} from '../../services';

const heightScreen = Dimensions.get('window').height;
const WorkArea = ({navigation}) => {
  console.log('in scan work area page');
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  let scanner;
  const startScan = () => {
    if (scanner) {
      scanner._setScanning(false);
    }
  };
  const onBarcodeRead = async scanResult => {
    setLoading(true);
    try {
      const params = {
        workArea: scanResult.data,
        username: LoginReducer.form.profile.uid,
      };
      console.log(params);
      const res = await WorkAreaAPIService.checkDataArea(params);
      if (res.data.status == 'valid') {
        const attribute = {
          workArea: scanResult.data,
        };
        navigation.replace('FormArea', attribute);
      } else {
        setLoading(false);
        Alert.alert('Attention', res.data.message, [
          {
            text: 'No',
            onPress: () => navigation.replace('AdminDashboard'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => startScan()},
        ]);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error',
        'Connection to API server failed with message : ' + error.message,
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      <Spinner
        visible={loading}
        textContent={'Check Area...'}
        textStyle={{color: '#FFF'}}
      />
      <QRCodeScanner
        ref={camera => (scanner = camera)}
        reactivate={true}
        reactivateTimeout={5000}
        onRead={onBarcodeRead}
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

export default WorkArea;
