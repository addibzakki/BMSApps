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
  Linking,
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
import {Body, Left, ListItem, Fab, Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {insert_pv_checklist_tmp} from '../../../../component/databases/insert/insert_pv_checklist_tmp';
import {insert_pv_checkstandart_tmp} from '../../../../component/databases/insert/insert_pv_checkstandart_tmp';
import {PreventiveAPIService} from '../../../../services';
import {db_pv_checklist_tmp} from '../../../../component/databases/create/create_pv_checklist_tmp';
import {db_pv_checkstandart_tmp} from '../../../../component/databases/create/create_pv_checkstandart_tmp';
import { WebView } from 'react-native-webview';

const AdminPreventiveAssetHistory = ({navigation, route}) => {
  console.log('Halaman list asset history preventif');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [fabActive, setFabActive] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      const res = await PreventiveAPIService.getListAssetHistory(route.params.barcode);
      setList([...res.data]);
      setRefresh(false);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
      setRefresh(false);
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => {
    console.log(item);
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => Linking.openURL("https://mmpportal.mmproperty.com/bm/preventive-maintenance/transactions/print/"+item.pm_id)}
        >
        <Body>
          <Text style={{fontWeight: 'bold'}}>{'#' + item.trans_code}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
           }}
          />
          <TextLineIndentLight
            label="Asset"
            value={item.asset_name}
          />
          <TextLineIndentLight
            label="Schedule"
            value={item.schedule_date}
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
        <Text style={global_style.text_empty}>NO LISTING HISTORY</Text>
      </View>
    );
  };


  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle="Listing Asset History"
        onPress={() => {
          if (LoginReducer.form.profile.level === 'Supervisor') {
            navigation.navigate('AdminPreventiveDashboard');
          } else {
            navigation.navigate('AdminPreventif');
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
    </View>
  );
};

export default AdminPreventiveAssetHistory;
