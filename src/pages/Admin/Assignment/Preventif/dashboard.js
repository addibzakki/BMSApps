import React from 'react';
import {View} from 'react-native';
import {global_style} from '../../../../styles';
import {TopHeader, ListMenuGrid} from '../../../../component';

const AdminPreventiveDashboard = ({navigation}) => {
  const list = [
    {
      key: 0,
      title: 'List',
      icon: 'ios-list-outline',
      nav: 'AdminPreventif',
      badge: false,
      count: 0,
    },
    {
      key: 1,
      title: 'History',
      icon: 'ios-calendar-outline',
      nav: 'AdminPreventifListHistory',
      badge: false,
      count: 0,
    },
    {
      key: 2,
      title: 'Approval',
      icon: 'ios-create-outline',
      nav: 'AdminSPVPreventifApproval',
      badge: false,
      count: 0,
    },
  ];
  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle="Dashboard"
        onPress={() => navigation.navigate('AdminAssignment')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ListMenuGrid list={list} navigation={navigation} itemDimension={130} />
      </View>
    </View>
  );
};

export default AdminPreventiveDashboard;
