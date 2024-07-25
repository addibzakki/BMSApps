import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ListTicket, TopHeader} from '../../../../component';
import {CorrectiveAPIService} from '../../../../services';
import {setRefresh} from '../../../../redux';
import { global_style } from '../../../../styles';
import { Searchbar } from 'react-native-paper';
import { colorLogo } from '../../../../utils';

const AdminHelpdeskList = ({navigation}) => {
  console.log('On page list ticket by status');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const TicketReducer = useSelector(state => state.TicketReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [list, setList] = useState([]);
  const [listFilter, setListFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // when refresh true
    if (GlobalReducer.refresh === true) {
      getData();
      console.log('refresh : true');
    }
    // when focused true
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh === true]);

  const getData = async () => {
    try {
      const params = {
        usernm: LoginReducer.form.profile.uid,
        level: LoginReducer.form.profile.level,
        status: CorrectiveReducer.ticket_status_id,
      };
      const res = await CorrectiveAPIService.getListTicket(params);
      setList([...res.data.list]);
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert(error.message);
      dispatch(setRefresh(false));
    }
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    const newFilter = list.filter(item => {
      return (item.tenant_ticket_id.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.tenant_ticket_location.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
    setListFilter(newFilter);
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Assignment"
        subTitle={TicketReducer.state}
        onPress={() => navigation.replace('AdminHelpdeskDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={global_style.content}>
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
          <View style={{borderWidth: 1, borderBottomColor: colorLogo.color5, marginBottom: 10}} />
          <ListTicket list={searchQuery == '' ? list : listFilter} navigation={navigation} />
        </View>
      </View>
    </View>
  );
};

export default AdminHelpdeskList;
