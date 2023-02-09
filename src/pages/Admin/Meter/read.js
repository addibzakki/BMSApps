import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {ListItem, Button, Icon, Body, Text, Right} from 'native-base';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axios from 'axios';
import moment from 'moment';

const widthScreen = Dimensions.get('window').width;
const AdminMeterRead = ({navigation, route}) => {
  const [listElectric, setListElectric] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const getData = () => {
    const url =
      'https://mmpportal.mmproperty.com/api/search_meter/' +
      route.params.type +
      '/' +
      route.params.tenant +
      '/R';
    axios
      .get(url)
      .then(function(response) {
        setListElectric([...response.data]);
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

  const renderElectric = ({item, index}) => {
    var statusCo = '';
    if (item.flag == 'U') {
      statusCo = '#ffca28';
    } else {
      statusCo = '#ba68c8';
    }

    return (
      <ListItem key={index} avatar>
        <Body>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Meter ID</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text style={{fontWeight: 'bold'}}>: {item.meter_id}</Text>
            </View>
          </View>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Last Date</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text>
                : {moment(item.last_read_date).format('DD MMMM YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Last Read</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text>
                : {item.last_read} {item.uom}
              </Text>
            </View>
          </View>
        </Body>
        <Right>
          <Button
            rounded
            small
            style={{backgroundColor: statusCo}}
            onPress={() => navigation.navigate('AdminMeterDetail', item)}>
            <Icon type="FontAwesome" active name="info-circle" />
          </Button>
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

  var type_text = '';
  if (route.params.type === 'EL') {
    type_text = 'Electric';
  } else {
    type_text = 'Water';
  }

  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colorLogo.color2}
      />
      <TopHeader
        title={'Read ' + type_text}
        subTitle={route.params.tenant_name}
        onPress={() => navigation.navigate('AdminMeterFilter')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.space(10)} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listElectric}
        renderItem={renderElectric}
        ListEmptyComponent={renderEmpty(loading)}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
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

export default AdminMeterRead;
