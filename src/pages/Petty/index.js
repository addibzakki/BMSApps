import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../component';
import { colorLogo } from '../../utils';
import moment from 'moment';
import { Body, Left, ListItem } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import PettyLAPIService from '../../services/Petty/PettyAPIService';

const PettyDashboard = ({navigation}) => {

  const LoginReducer = useSelector(state => state.LoginReducer);
  const [listTopup, setListTopup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      checkPetty()
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

  const checkPetty = async () => {
    try {
      const res = await PettyLAPIService.getBalance(LoginReducer.form.profile.uid);
      console.log(res.data.data);
      setBalance(res.data.data.balance_format);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  const handleNavigation = (item) => {
    navigation.navigate('PettyDetail', item);
  };

  const renderItem = ({ item, index }) => {
    if (item.status == 'S') {
      var status_color = 'orange';
    } else {
      var status_color = 'red';
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
          <TextLineIndentLight label="Desc" value={item.descs} />
          <TextLineIndentLight
            label="Date"
            value={moment(item.created_at).format('DD MMMM YYYY')}
          />
          <TextLineIndentLight label="Amount Transfer" value={item.amount_format} />
          {/* <TextLineIndentLight label="Status" value={item.status} /> */}
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
      <TopHeader
        title="Petty Cash"
        subTitle="List Transaction"
        onPress={() => navigation.replace('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.wrapper.menu}>
          <View
            style={{
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 20,
              marginHorizontal: 10,
              // backgroundColor: colorLogo.color4,
              paddingVertical: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Saldo Cash Advance : {balance}</Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate('PettyDashboard')}>
                <MaterialCommunityIcons
                  name="account-cash-outline"
                  color="white"
                  size={28}
                />
              </TouchableOpacity> */}
            </View>
          </View>
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

export default PettyDashboard;
