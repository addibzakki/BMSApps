import React, { useState } from 'react';
import { Alert, Dimensions, Modal, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { global_style } from '../../../../styles';
import { TopHeader } from '../../../../component';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';
import { colorLogo } from '../../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setRefresh } from '../../../../redux';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';

const AdminPreventive = ({ navigation }) => {
  console.log('index');
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const handleGoTo = screen => {
    navigation.navigate(screen);
  };
  let scanner;
  const startScan = () => {
    if (scanner) {
      scanner._setScanning(false);
    }
  };

  const onBarCodeRead = scanResult => {
    try {
      setModalVisible(false);
      navigation.navigate('AdminPreventiveAssetHistory', { barcode: JSON.parse(scanResult.data).barcode });
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Attention',
        'Barcode doesnt match, would you like to rescan?',
        [
          {
            text: 'No',
            onPress: () => setModalVisible(!modalVisible),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => startScan() },
        ],
      );
    }
  };

  const list = [
    {
      key: 0,
      title: 'Assignment',
      icon: 'ios-list-outline',
      nav: 'AdminPreventiveAssignment',
      badge: false,
      count: 0,
      type: 'nav',
    },
    {
      key: 1,
      title: 'History Asset',
      icon: 'ios-calendar-outline',
      nav: 'AdminPreventifScanHistory',
      badge: false,
      count: 0,
      type: 'act',
    }
  ];

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => (item.type == 'nav'?handleGoTo(item.nav):setModalVisible(true))}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
          backgroundColor: colorLogo.color4,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          paddingVertical: 10,
          height: 150,
          flex: 1,
        }}>
        {item.badge == true && (
          <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <Badge style={{ position: 'absolute', top: 0, right: 0 }}>
              <Text style={{ color: '#FFFFFF', fontSize: RFPercentage(2) }}>
                {item.count}
              </Text>
            </Badge>
          </View>
        )}

        <Icon
          name={item.icon}
          size={50}
          color="white"
          style={{ marginBottom: 5 }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: RFPercentage(2),
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle="Dashboard"
        onPress={() => navigation.navigate('AdminAssignment')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}>
          <View style={global_style.modal_full_opacity}>
            <View
              style={[global_style.modal_full_content, { paddingTop: 0 }]}>
              <QRCodeScanner
                fadeIn={false}
                ref={camera => (scanner = camera)}
                reactivate={true}
                reactivateTimeout={5000}
                onRead={onBarCodeRead}
                flashMode={RNCamera.Constants.FlashMode.auto}
                showMarker={true}
                customMarker={
                  <BarcodeMask
                    width={300}
                    height={300}
                    showAnimatedLine={true}
                    outerMaskOpacity={0.5}
                  />
                }
                containerStyle={{ alignItems: 'center' }}
                cameraStyle={{
                  overflow: 'hidden',
                  position: 'absolute',
                  height: '90%',
                  width: Dimensions.get('window').width,
                  borderRadius: 20,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colorLogo.color1,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    marginHorizontal: 5,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <FlatGrid
          fixed={false}
          itemDimension={130}
          data={list}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
        />
      </View>
    </View>
  );
};

export default AdminPreventive;
