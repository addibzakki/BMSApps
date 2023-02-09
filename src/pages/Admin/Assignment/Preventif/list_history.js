import React, {useEffect, useState} from 'react';
import {View, Alert, RefreshControl, FlatList, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import {setPVTransCode} from '../../../../redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {PreventiveAPIService} from '../../../../services';
import {Left, ListItem, Body} from 'native-base';

const AdminPreventifListHistory = ({navigation}) => {
  console.log('in page list history preventif');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, refresh == true]);

  const getData = async () => {
    try {
      const params = 'username=' + LoginReducer.form.profile.uid;
      const res = await PreventiveAPIService.getListHistoryPreventif(params);
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

  const onRefresh = () => {
    setRefresh(true);
  };

  const handleGoTo = item => {
    dispatch(setPVTransCode(item.trans_code));
    navigation.navigate('AdminPreventifListShowHistoryChecklist');
  };

  const renderItem = ({item, index}) => {
    let background_color = item.bms_status.status_color.replace(/\s/g, '');
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleGoTo(item)}>
        <Left
          style={{
            backgroundColor: background_color,
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
              borderColor: item.bms_status.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={item.bms_status.status_name}
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
        subTitle="Listing History Preventive"
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

          {/* <ListHistoryPreventif list={list} navigation={navigation} /> */}
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifListHistory;
