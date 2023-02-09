import React, {useEffect, useState} from 'react';
import {Alert, FlatList, RefreshControl, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../component';
import {colorLogo} from '../../../utils';
import SPLAPIService from '../../../services/SPL/APIservice';
import moment from 'moment';
import {Body, Left, ListItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

const ListSPL = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [listRequestSPL, setListRequestSPL] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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
      const data = {
        username: LoginReducer.form.profile.uid,
        level: LoginReducer.form.profile.level,
        type: 'Request',
      };
      const res = await SPLAPIService.processGetHistorySPL(data);
      setListRequestSPL([...res.data]);
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

  const handleNavigation = spl_cd => {
    navigation.navigate('ShowSPL', {
      spl_cd: spl_cd,
    });
  };

  const renderItem = ({item, index}) => {
    if (item.request_status == 'waiting') {
      var status_color = 'orange';
    } else if (item.request_status == 'taken') {
      var status_color = 'blue';
    } else if (item.request_status == 'close') {
      var status_color = 'green';
    } else if (item.request_status == 'reject') {
      var status_color = 'grey';
    } else if (item.request_status == 'approve') {
      var status_color = 'cornflowerblue';
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
        onPress={() => handleNavigation(item.spl_cd)}>
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
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold'}}>{'#' + item.spl_cd}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: status_color,
            }}
          />
          <TextLineIndentLight label="Requester" value={item.engineer_name} />
          <TextLineIndentLight
            label="Date"
            value={moment(item.request_date).format('DD MMMM YYYY')}
          />
          <TextLineIndentLight label="Location" value={item.location_descs} />
          <TextLineIndentLight label="Status" value={item.status_descs} />
        </Body>
      </ListItem>
    );
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NOTHING LIST OVERTIME
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
          data={listRequestSPL}
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
        title="SPL"
        subTitle="List Overtime"
        onPress={() => navigation.replace('AdminSPL')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.wrapper.menu}>
          {content()}
          {/* <ListItemSPL
            list={listRequestSPL}
            navigation={navigation}
            onRefresh={() => onRefresh()}
            refresh={loading}
          /> */}
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

export default ListSPL;
