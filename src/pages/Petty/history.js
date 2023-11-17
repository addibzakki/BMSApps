import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../component';
import { colorButton, colorLogo } from '../../utils';
import moment from 'moment';
import { Body, Left, ListItem } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import Spinner from 'react-native-loading-spinner-overlay';

const PettyHistory = ({navigation}) => {

  const LoginReducer = useSelector(state => state.LoginReducer);
  const [listTopup, setListTopup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loadingReceive, setLoadingReceive] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await PettyLAPIService.getListTopup(LoginReducer.form.profile.uid);
      setListTopup([...res.data.data]);
      setLoading(false);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
      setLoading(false);
      setRefresh(false);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  const receive = async(item) => {
    Alert.alert('Attention', 'Are you sure want to receive this top up?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleReceive(item) },
    ]);
  }

  const handleReceive = async(item) => {
    setLoadingReceive(true);
    try {
      const data = {
        id: item.id,
        user: item.receive_by,
      };
      const res = await PettyLAPIService.receiveTopUp(data);
      setLoadingReceive(false);
      getData();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
      setLoadingReceive(false);
      setRefresh(false);
    }
  };

  const handleNavigation = (item) => {
    navigation.navigate('PettyDetail', item);
  };

  const renderItem = ({ item, index }) => {
    if (item.status == 'R') {
      var status_color = 'orange';
    } else {
      if (item.status_settle == 'P') {
        var status_color = 'red';
      } else if (item.status_settle == 'A4') {
        var status_color = 'blue';
      } else {
        var status_color = 'green';
      }
    }
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleNavigation(item)}>
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
            <Icon
              active
              name="bookmarks-outline"
              style={{ fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold' }}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{ fontWeight: 'bold' }}>{'#' + item.doc_no}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: status_color,
            }}
          />
          <TextLineIndentLight label="Entity" value={item.location} />
          <TextLineIndentLight label="Category" value={item.category_desc} />
          <TextLineIndentLight label="Desc" value={item.descs} />
          <TextLineIndentLight
            label="Date"
            value={moment(item.transfer_date).format('DD MMMM YYYY')}
          />
          <TextLineIndentLight label="Amount Transfer" value={item.amount_format} />
          <TextLineIndentLight label="Status" value={(item.status_settle == null ? item.status_desc : item.status_settle_desc)} />
          {item.status_settle == 'P' && (<TextLineIndentLight label="Remark" value={item.remarks} />)}
        </Body>
      </ListItem>
    );
  };

  const renderEmpty = () => {
    return (
      <View
        style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          NOTHING TRANSACTION
        </Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={50} />;
    } else {
      return (
        <FlatList
          data={listTopup}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      );
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loadingReceive}
        textContent={'Receiving Top Up...'}
        textStyle={{ color: '#FFF' }}
      />
      <TopHeader
        title="Petty Cash"
        subTitle="History Transaction"
        onPress={() => navigation.replace('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.wrapper.menu}>
          {content()}
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
      paddingTop: 5,
    },
    menu: {
      marginHorizontal: 10,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default PettyHistory;
