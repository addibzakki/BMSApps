import React, {useEffect, useState} from 'react';
import {View, FlatList, Dimensions, RefreshControl} from 'react-native';
import {ListItem, Left, Button, Icon, Body, Text, Right} from 'native-base';
import {TextLineIndentLight, TopHeader} from '../../../component';
import axios from 'axios';
import {useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import {colorLogo} from '../../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFPercentage} from 'react-native-responsive-fontsize';

const widthScreen = Dimensions.get('window').width;
const AdminOvertimeList = ({navigation, route}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [listStatus, setListStatus] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const getData = () => {
    // const url =
    //   'https://mynet.mmproperty.com/api/get_overtime_list/' +
    //   route.params.status;
    // axios
    //   .get(url)
    //   .then(function(response) {
    //     setListStatus([...response.data.list]);
    //     setTotal([...response.data.total]);
    //     setLoading(false);
    //     setRefresh(false);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //     setLoading(false);
    //     setRefresh(false);
    //   });

    const data = {
      username: LoginReducer.form.profile.uid,
      status: route.params.status,
    };

    const url = 'https://mynet.mmproperty.com/api/get_overtime_list';
    axios
      .post(url, data)
      .then(function(response) {
        setListStatus([...response.data.list]);
        setTotal([...response.data.total]);
        setLoading(false);
        setRefresh(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setRefresh(false);
      });
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  const renderOvertime = ({item, index}) => {
    const sendData = {
      overtimeAction: 'approval',
      overtimeCode: item.overtime_code,
      tenant: item.tenant_id,
      tenant_name: item.tenant_name,
      overtimeType: item.overtime_type,
      overtimeZone: item.overtime_zone,
      overtimeStart: item.overtime_start,
      overtimeEnd: item.overtime_end,
      overtimeDuration: item.overtime_duration,
      overtimeTotalUser: item.total_user,
      overtimeUser: item.overtime_user,
      overtimeDate: item.overtime_date,
      overtimeDateFormat: item.overtimeDateFormat,
      overtimeStatus: item.overtime_status,
      overtimeStatusCode: item.overtime_status_code,
      status: route.params.status,
    };

    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => navigation.navigate('AdminOvertimeShow', sendData)}>
        <Left
          style={{
            backgroundColor: item.status_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Ionicons
              active
              name="alarm-outline"
              style={{
                fontSize: RFPercentage(2.5),
                paddingHorizontal: 5,
                fontWeight: 'bold',
                color: 'white',
              }}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold', fontSize: RFPercentage(2)}}>
            {'#' + item.overtime_code}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: RFPercentage(2)}}>
            {moment(item.overtime_date).format('DD MMMM YYYY')}
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight label="Tenant" value={item.tenant_name} />
          <TextLineIndentLight label="Zone" value={item.overtime_zone} />
          <TextLineIndentLight label="Status" value={item.overtime_status} />
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
          <Text style={{fontSize: RFPercentage(3), fontWeight: 'bold'}}>
            DATA NOT AVAILABLE
          </Text>
        </View>
      );
    }
  };

  var title = '';
  if (route.params.status == 1) {
    title = 'Overtime Request';
  } else if (route.params.status == 8) {
    title = 'Modify Request';
  } else {
    title = 'All';
  }

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Overtime"
        subTitle={title + ' (' + total + ')'}
        onPress={() => navigation.replace('AdminOvertime')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.wrapper.menu}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listStatus}
            renderItem={renderOvertime}
            ListEmptyComponent={renderEmpty(loading)}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
          />
        </View>
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
      paddingTop: 10,
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 10,
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  text: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminOvertimeList;
