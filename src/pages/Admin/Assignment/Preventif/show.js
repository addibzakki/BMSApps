import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader} from '../../../../component';
import {global_style} from '../../../../styles';

const AdminPreventifShow = ({route, navigation}) => {
  console.log('In Page List Detail Preventif');

  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

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
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message);
    }
  };

  const onRefresh = async () => {
    await getData();
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle={'#' + PreventifReducer.attribute.trans_code}
        onPress={() => {
          if (LoginReducer.form.profile.level === 'Supervisor') {
            navigation.navigate('AdminSPVPreventifDashboard');
          } else {
            navigation.navigate('AdminPreventiveAssignment');
          }
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>
          {/* <ListPreventifDetail
            list={list}
            navigation={navigation}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifShow;
