import React, {useEffect, useState} from 'react';
import {View, StatusBar, FlatList, Dimensions, Alert} from 'react-native';
import {ListItem, Icon, Body, Text, Right, Fab} from 'native-base';
import {TopHeader, AlertConfirmation} from '../../../component';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import {colorLogo} from '../../../utils';

const widthScreen = Dimensions.get('window').width;
const AdminOvertimeResult = ({navigation, route}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setLoading(true);
      getData();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  console.log(route.params);
  const getData = () => {
    const data = {
      company: route.params.company,
      endTime: route.params.endTime,
      startTime: route.params.startTime,
      status: route.params.status,
    };
    axios
      .post('https://mynet.mmproperty.com/api/overtime_result', data)
      .then(function(response) {
        setListData([...response.data]);
        setLoading(false);
      })
      .catch(function(response) {
        console.log(response);
        setLoading(false);
      });
  };
  const HandleExportExcel = () => {
    const data = {
      company: route.params.company,
      status: route.params.status,
      generateBy: 'Ninik Heryani',
      // emailTo: LoginReducer.form.profile.tenant_email,
      startTime: route.params.startTime,
      endTime: route.params.endTime,
    };
    axios
      .post('https://mynet.mmproperty.com/api/export_excel', data)
      .then(function(response) {
        if (response.data.message == 'success') {
          Alert.alert('success', 'Please check your email');
          setVisible(false);
        } else {
          Alert.alert('error', 'Data not be export');
          setVisible(false);
        }
      })
      .catch(function(response) {
        console.log(response);
        Alert.alert('error', 'Something wrong');
      });
  };

  const renderOvertime = ({item, index}) => {
    var statusCo = '';
    if (item.status == '0') {
      statusCo = '#ffca28';
    } else if (item.status == '1') {
      statusCo = '#81c784';
    } else if (item.status == '2') {
      statusCo = '#4fc3f7';
    } else {
      statusCo = '#ba68c8';
    }

    var type = '';
    var zone = '';
    if (item.hkac != '') {
      type = 'Working Day (AC)';
      zone = item.hkac;
    } else if (item.hknac != '') {
      type = 'Working Day (Non AC)';
      zone = item.hknac;
    } else if (item.hlac != '') {
      type = 'Non Working Day (AC)';
      zone = item.hlac;
    } else {
      type = 'Non Working Day (Non AC)';
      zone = item.hlnac;
    }

    return (
      <ListItem key={index} avatar>
        <Body>
          <View>
            <Text style={{fontWeight: 'bold'}}>{'#' + item.overtime_code}</Text>
          </View>
          <View style={styles.space(7)} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '7%'}}>
              <Icon
                type="FontAwesome"
                active
                name="map-marker"
                style={{fontSize: 12}}
              />
            </View>
            <View style={{width: '40%'}}>
              <Text>{'Zone '}</Text>
            </View>
            <View style={{width: '53%'}}>
              <Text>{': ' + zone}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '7%'}}>
              <Icon
                type="FontAwesome"
                active
                name="tag"
                style={{fontSize: 12}}
              />
            </View>
            <View style={{width: '40%'}}>
              <Text>{'Type '}</Text>
            </View>
            <View style={{width: '53%'}}>
              <Text>{': ' + type}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '7%'}}>
              <Icon
                type="FontAwesome"
                active
                name="clock-o"
                style={{fontSize: 12}}
              />
            </View>
            <View style={{width: '40%'}}>
              <Text>{'Time '}</Text>
            </View>
            <View style={{width: '53%'}}>
              <Text>{': ' + item.timeFrom + ' - ' + item.timeTo}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '7%'}}>
              <Icon
                type="FontAwesome"
                active
                name="hourglass"
                style={{fontSize: 12}}
              />
            </View>
            <View style={{width: '40%'}}>
              <Text>{'Overtime Hours '}</Text>
            </View>
            <View style={{width: '53%'}}>
              <Text>{': ' + item.totalOvertime}</Text>
            </View>
          </View>
        </Body>
        <Right>
          <Text note>{item.day},</Text>
          <Text note>{moment(item.overtime_date).format('D MMMM YYYY')}</Text>
        </Right>
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
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colorLogo.color2}
      />
      <TopHeader
        title="Overtime"
        subTitle="Result"
        onPress={() => navigation.replace('AdminOvertimeReport')}
      />
      <AlertConfirmation
        width={80}
        visible={visible}
        callbackLeftText="Send"
        callbackLeft={() => HandleExportExcel()}
        callbackRightText="Cancel"
        callbackRight={() => setVisible(false)}
        content={
          <View>
            <Text style={{fontSize: 16, letterSpacing: 1}}>
              Are you sure you want to send the report by email ?
            </Text>
          </View>
        }
      />
      <View style={styles.space(10)} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listData}
        renderItem={renderOvertime}
        ListEmptyComponent={renderEmpty(loading)}
        keyExtractor={(item, index) => index.toString()}
      />

      <Fab
        active={true}
        containerStyle={{}}
        style={{backgroundColor: colorLogo.color1}}
        position="bottomRight"
        onPress={() => setVisible(true)}>
        <Icon name="mail" />
      </Fab>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
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

export default AdminOvertimeResult;
