import React, {useEffect, useState} from 'react';
import {View, FlatList, RefreshControl, Text, Alert} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {ListTicket, SkeletonFake, TopHeader} from '../../../../component';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {colorLogo} from '../../../../utils';
import {CorrectiveAPIService} from '../../../../services';
import { setParamsRouteCorrective } from '../../../../redux';
import { Searchbar } from 'react-native-paper';

const AdminHelpdeskHistory = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [listHistory, setListHistory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [listFilter, setListFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const getData = async () => {
    try {
      const res = await CorrectiveAPIService.getTicketHistory(
        LoginReducer.form.profile,
      );
      setListHistory([...res.data]);
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

  const HandleShowDetail = item => {
    dispatch(setParamsRouteCorrective(item));
    navigation.navigate('AdminHelpdeskShow');
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
        onPress={() => HandleShowDetail(item)}>
        <Left
          style={{
            backgroundColor: item.status_color.trim(),
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
          <Text style={{fontWeight: 'bold'}}>
            {'#' + item.tenant_ticket_id}
          </Text>
          <Text>
            <Icon
              type="Ionicons"
              active
              name="chevron-forward-circle-outline"
              style={{fontSize: 12}}
            />
            {' ' + item.tn_ticket_post_fulldate}
          </Text>
          <Text>
            <Icon
              type="Ionicons"
              active
              name="chevron-forward-circle-outline"
              style={{fontSize: 12}}
            />{' '}
            {'Form : ' + item.form_desc}
          </Text>
          <Text>
            <Icon
              type="Ionicons"
              active
              name="chevron-forward-circle-outline"
              style={{fontSize: 12}}
            />{' '}
            {'Category : ' + item.category_desc}
          </Text>
          <Text>
            <Icon
              type="Ionicons"
              active
              name="chevron-forward-circle-outline"
              style={{fontSize: 12}}
            />{' '}
            {'Location : ' + item.tenant_ticket_location}
          </Text>
        </Body>
      </ListItem>
    );
  };

  const renderEmpty = loading => {
    if (loading == true) {
      return <SkeletonFake row={5} />;
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

  const onChangeSearch = query => {
    setSearchQuery(query);
    const newFilter = listHistory.filter(item => {
      return (item.tenant_ticket_id.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.tenant_ticket_location.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
    setListFilter(newFilter);
  };

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Helpdesk"
        subTitle="Ticket History"
        onPress={() => navigation.navigate('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.wrapper.menu}>
          <Searchbar
            style={{
              marginTop: 5,
              marginBottom: 10,
              borderRadius: 15,
              borderBottomWidth: 1
            }}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <View style={{ borderWidth: 1, borderBottomColor: colorLogo.color5, marginBottom: 10 }} />
          <ListTicket list={searchQuery == '' ? listHistory : listFilter} navigation={navigation} />
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
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminHelpdeskHistory;
