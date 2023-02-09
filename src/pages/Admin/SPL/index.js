import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader, ListMenuGrid} from '../../../component';
import {sub_menu_spl} from '../../../data';
import {global_style} from '../../../styles';
const AdminSPL = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const level = LoginReducer.form.profile.level;
  return (
    <View style={global_style.page}>
      <TopHeader
        title="SPL"
        onPress={() => navigation.navigate('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ListMenuGrid
          list={sub_menu_spl[0][level]}
          navigation={navigation}
          itemDimension={130}
        />
      </View>
    </View>
  );
};

export default AdminSPL;
