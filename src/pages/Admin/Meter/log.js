import React, {useEffect, useState} from 'react';
import {View, FlatList, Dimensions, RefreshControl} from 'react-native';
import {ListItem, Button, Icon, Body, Text, Right, Left} from 'native-base';
import {
  TextLineIndent,
  TextLineIndentLight,
  TopHeader,
} from '../../../component';
import {colorLogo} from '../../../utils';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axios from 'axios';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../redux';

const widthScreen = Dimensions.get('window').width;
const AdminMeterLog = ({navigation, route}) => {
  console.log('In page log meter transaction');
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log();

  useEffect(() => {
    getData();
  }, [GlobalReducer.refresh === true]);

  const getData = async () => {
    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM bms_meter_log',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          setList(temp);
          console.log('select table successfully');
        },
        error => {
          console.log('error on select table list_meter ' + error.message);
        },
      );
    });
  };

  const onRefresh = () => {
    dispatch(setRefresh(true));
  };

  const renderItem = ({item, index}) => {
    let status_color;
    if (item.status_trx == 'success') {
      status_color = '';
    } else if (item.status_trx == 'duplicate') {
      status_color = '';
    } else {
      status_color = '';
    }
    return (
      <ListItem key={index} avatar>
        <Left
          style={{
            backgroundColor: status_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Ionicons
              active
              name="bookmarks-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold'}}>{'#' + item.meter_id}</Text>
          <Text style={{fontWeight: 'bold'}}>
            {moment(item.curr_read_date).format('DD MMMM YYYY')}
          </Text>
          <View
            style={{
              backgroundColor: status_color,
              borderWidth: 0.5,
              marginVertical: 5,
            }}
          />
          <TextLineIndentLight label="Capture By" value={item.read_by} />
          <TextLineIndentLight label="Status" value={item.status_trx} />
        </Body>
      </ListItem>
    );
  };

  const renderEmpty = loading => {
    if (loading == true) {
      var fakeStatus = [];
      for (let i = 0; i < 5; i++) {
        fakeStatus.push(
          <View key={i} style={{flex: 1, alignItems: 'center', margin: 5}}>
            <View
              style={{width: widthScreen - 20, height: 40, marginBottom: 2}}
            />
            <View
              style={{width: widthScreen - 20, height: 40, marginBottom: 2}}
            />
            <View
              style={{width: widthScreen - 20, height: 50, marginBottom: 2}}
            />
          </View>,
        );
      }
      return <SkeletonPlaceholder>{fakeStatus}</SkeletonPlaceholder>;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            DATA NOT AVAILABLE
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title={'List'}
        subTitle={'Log Meter Capture'}
        onPress={() => navigation.navigate('AdminMeterHistory')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.space(10)} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={onRefresh}
            />
          }
        />
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
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeterLog;
