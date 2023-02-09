import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {ListMenuGrid, TopHeader} from '../../../component';
import {global_style} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {CorrectiveAPIService, PreventiveAPIService} from '../../../services';
import {setRefresh} from '../../../redux';

const AdminAssignment = ({navigation}) => {
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [countPreventif, setCountPreventif] = useState(0);
  const [countCorrective, setCountCorrective] = useState(0);
  useEffect(() => {
    // when refresh true
    if (GlobalReducer.refresh == true) {
      getCountPreventif();
      console.log('refresh : true');
    }
    // when focused true
    const unsubscribe = navigation.addListener('focus', () => {
      getCountPreventif();
      console.log('focus : true');
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh == true]);

  const getCountPreventif = async () => {
    try {
      const params = 'username=' + LoginReducer.form.profile.uid;
      const res = await PreventiveAPIService.getListPreventif(params);
      setCountPreventif(res.data.meta.pagination.total);
      const resCorrective = await CorrectiveAPIService.getTotalCorrective([
        LoginReducer.form.profile.uid,
        LoginReducer.form.profile.level,
      ]);
      console.log(
        `Total Corrective : ${
          resCorrective.data.total_corrective
        } & Total Preventif : ${res.data.meta.pagination.total}`,
      );
      setCountCorrective(resCorrective.data.total_corrective);
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert('Error', error.message);
      dispatch(setRefresh(false));
      console.log(error);
    }
  };
  let list;
  if (LoginReducer.form.profile.level == 'Supervisor') {
    list = [
      {
        key: 0,
        title: 'PREVENTIVE MAINTENANCE',
        icon: 'ios-clipboard-outline',
        nav: 'AdminPreventiveDashboard',
        badge: true,
        count: countPreventif,
      },
      {
        key: 1,
        title: 'CORRECTIVE MAINTENANCE',
        icon: 'ios-build-outline',
        nav: 'AdminHelpdeskDashboard',
        badge: true,
        count: countCorrective,
      },
    ];
  } else {
    list = [
      {
        key: 0,
        title: 'PREVENTIVE MAINTENANCE',
        icon: 'ios-clipboard-outline',
        nav: 'AdminPICPreventifDashboard',
        badge: true,
        count: countPreventif,
      },
      {
        key: 1,
        title: 'CORRECTIVE MAINTENANCE',
        icon: 'ios-build-outline',
        nav: 'AdminHelpdeskDashboard',
        badge: true,
        count: countCorrective,
      },
    ];
  }
  return (
    <View style={global_style.page}>
      <TopHeader
        title="Assignment"
        onPress={() => navigation.navigate('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ListMenuGrid list={list} navigation={navigation} itemDimension={130} />
      </View>
    </View>
  );
};

export default AdminAssignment;
