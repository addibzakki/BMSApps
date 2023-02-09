import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  FlatList,
  RefreshControl,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  dropTable,
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import {setPVChecklistAttr} from '../../../../redux';
import Spinner from 'react-native-loading-spinner-overlay';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {colorLogo} from '../../../../utils';
import {Body, Left, ListItem, Fab} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {insert_pv_checklist_tmp} from '../../../../component/databases/insert/insert_pv_checklist_tmp';
import {insert_pv_checkstandart_tmp} from '../../../../component/databases/insert/insert_pv_checkstandart_tmp';
import {PreventiveAPIService} from '../../../../services';
import {db_pv_checklist_tmp} from '../../../../component/databases/create/create_pv_checklist_tmp';
import {db_pv_checkstandart_tmp} from '../../../../component/databases/create/create_pv_checkstandart_tmp';

const AdminPreventif = ({navigation}) => {
  console.log('Halaman awal preventif');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      const params = 'username=' + LoginReducer.form.profile.uid;
      const res = await PreventiveAPIService.getListPreventif(params);
      setList([...res.data.data]);
      setRefresh(false);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
      setRefresh(false);
      setLoading(false);
    }
  };

  let scanner;
  const startScan = () => {
    if (scanner) {
      scanner._setScanning(false);
    }
  };

  const onBarCodeRead = scanResult => {
    try {
      if (JSON.parse(scanResult.data).barcode == item.asset_detail.barcode) {
        handleGoTo();
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
          {text: 'Yes', onPress: () => startScan()},
        ],
      );
    }
  };

  const insertIntoCheckStandard = async (
    id,
    transaksi_preventive_maintenance_id,
  ) => {
    const res = await PreventiveAPIService.getAllCheckStandart(id);
    if (res.data.data.length > 0) {
      res.data.data.map(val => {
        let attr = {
          id: val.id,
          id_checklist: id,
          status: val.status === null ? null : val.status['status_id'],
          remark: val.remark,
          images: val.image['link'],
          task_name: val.task_detail['name'],
          task_description: val.task_detail['description'],
          image_required: val.image_required,
          video_required: val.video_required,
          task_id: val.task_detail['id'],
          required: val.required,
          transaksi_preventive_maintenance_id: transaksi_preventive_maintenance_id,
          status_option: JSON.stringify(val.task_detail['status_values']),
        };
        insert_pv_checkstandart_tmp(db, attr);
      });
    }
  };

  const handleGoTo = async () => {
    setProcessing(true);
    try {
      dispatch(setPVChecklistAttr(item));
      const res = await PreventiveAPIService.getAllChecklist(item.id);
      if (res.data.data.length > 0) {
        let count = 0;
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
            total_check_standard: val.total_check_standard,
          };
          insert_pv_checklist_tmp(db, attr);
          insertIntoCheckStandard(
            val.id,
            val.transaksi_preventive_maintenance_id,
          );
          count++;
          if (count == res.data.data.length) {
            setModalVisible(!modalVisible);
            setProcessing(false);
            navigation.navigate('AdminPreventifPhotoBefore');
          }
        });
      } else {
        setProcessing(false);
        Alert.alert('Error', 'Cheklist empty');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setProcessing(false);
    }
  };

  const handleOpenScan = data => {
    setModalVisible(!modalVisible);
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
            backgroundColor: item.status.status_color.substring(0, 7),
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
          <TextLineIndentLight
            label="Asset"
            value={item.asset_detail.asset_name}
          />
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
    setRefresh(true);
    getData();
  };

  const renderEmpty = () => {
    return (
      <View style={global_style.container_empty}>
        <Text style={global_style.text_empty}>NO LISTING PREVENTIVE</Text>
      </View>
    );
  };

  const resetCache = async () => {
    Alert.alert(
      'Attention',
      'Are you sure want to reset cache? All preventive data that has not been captured will be deleted',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => recreateTable()},
      ],
    );
  };

  const recreateTable = async () => {
    dropTable(db, 'pv_checklist_tmp');
    dropTable(db, 'pv_checkstandart_tmp');
    db_pv_checklist_tmp(db);
    db_pv_checkstandart_tmp(db);
    onRefresh();
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle="Listing Preventive"
        onPress={() => {
          if (LoginReducer.form.profile.level === 'Supervisor') {
            navigation.navigate('AdminPreventiveDashboard');
          } else {
            navigation.navigate('AdminAssignment');
          }
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={global_style.sub_page}>
        <View style={global_style.content}>
          <View>
            <Spinner
              visible={processing}
              textContent={'Preparing data...'}
              textStyle={{color: '#FFF'}}
              overlayColor={'rgba(0, 0, 0, 0.60)'}
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <View style={global_style.modal_full_opacity}>
                <View
                  style={[global_style.modal_full_content, {paddingTop: 0}]}>
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
            {loading == true ? (
              <SkeletonFakeList row={8} height={110} />
            ) : (
              <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmpty()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
              />
            )}
          </View>
        </View>
      </View>
      <Fab
        active={true}
        containerStyle={{}}
        style={{backgroundColor: 'orange'}}
        position="bottomRight"
        onPress={() => resetCache()}>
        <Icon name="refresh-outline" />
      </Fab>
    </View>
  );
};

export default AdminPreventif;
