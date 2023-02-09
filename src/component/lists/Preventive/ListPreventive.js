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
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {colorLogo} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setPVChecklistAttr, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import PreventiveAPIService from '../../../services/Preventive/APIservice';
import {insert_pv_checklist_tmp} from '../../databases/insert/insert_pv_checklist_tmp';

export const ListPreventive = props => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [processing, setProcessing] = useState(false);

  let scanner;
  const startScan = () => {
    if (scanner) {
      scanner._setScanning(false);
    }
  };

  const onBarCodeRead = scanResult => {
    if (JSON.parse(scanResult.data).barcode === item.asset_detail.barcode) {
      handleGoTo();
      setModalVisible(!modalVisible);
    } else {
      Alert.alert(
        'Attention',
        'Barcode doesnt match, would you like to rescan?',
        [
          {
            text: 'No',
            onPress: () => setModalVisible(!modalVisible),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => startScan()},
        ],
      );
    }
  };

  const handleGoTo = async () => {
    try {
      dispatch(setPVChecklistAttr(item));
      const res = await PreventiveAPIService.getAllChecklist(item.id);
      if (res.data.data.length > 0) {
        res.data.data.map(val => {
          let attr = {
            id: val.id,
            transaksi_preventive_maintenance_id:
              val.transaksi_preventive_maintenance_id,
            name: val.task_group['name'],
            description: val.task_group['description'],
            status_id: val.bms_status['status_id'],
            status_name: val.bms_status['status_name'],
            status_color: val.bms_status['status_color'],
          };
          insert_pv_checklist_tmp(db, attr);
        });
      }
      props.navigation.navigate('AdminPreventifPhotoBefore');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleOpenScan = data => {
    setModalVisible(!modalVisible);
    console.log(data.asset_detail.barcode);
    setItem(data);
  };

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleOpenScan(item)}>
        <Left
          style={{
            backgroundColor: item.status.status_color,
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
          <Text style={{fontWeight: 'bold'}}>{'#' + item.trans_code}</Text>
          <Text style={{fontWeight: 'bold'}}>{item.assign_date}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status.status_color,
            }}
          />
          <TextLineIndentLight label="Status" value={item.status.status_name} />
          <TextLineIndentLight label="Type" value={item.asset.type} />
          <TextLineIndentLight label="Lokasi" value={item.location.name} />
          <TextLineIndentLight label="Schedule" value={item.schedule_date} />
          <TextLineIndentLight
            label="Barcode ID"
            value={item.asset_detail.barcode}
          />
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    dispatch(setRefresh(true));
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading === true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING PREVENTIF</Text>
        </View>
      );
    }
  };

  return (
    <View>
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={global_style.modal_full_opacity}>
          <View style={[global_style.modal_full_content, {paddingTop: 0}]}>
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
              containerStyle={{alignItems: 'center'}}
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
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={GlobalReducer.refresh}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};
