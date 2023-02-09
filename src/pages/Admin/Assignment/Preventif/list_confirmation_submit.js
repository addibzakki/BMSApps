import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {TopHeader} from '../../../../component';
import {global_style} from '../../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {setRefresh} from '../../../../redux';
import {ListConfirmationPreventiveSubmit} from '../../../../component/lists/Preventive/ListConfirmationPreventiveSubmit';
import {PreventiveAPIService} from '../../../../services';

const AdminPreventifConfirmSubmit = ({navigation}) => {
  console.log('In Page List Confirmation Preventif to Corrective');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    getData();
  }, [navigation, GlobalReducer.refresh === true]);

  const getData = async () => {
    try {
      const params = 'username=' + LoginReducer.form.profile.uid;
      const res = await PreventiveAPIService.getListPreventifSubmitList(params);
      setList([...res.data.data]);
      setLoading(false);
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      dispatch(setRefresh(false));
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />

      <TopHeader
        title="Preventive"
        subTitle={'Waiting Confirmation'}
        onPress={() => {
          if (LoginReducer.form.profile.level === 'Supervisor') {
            navigation.navigate('AdminPreventiveDashboard');
          } else {
            navigation.navigate('AdminAssignment');
          }
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>
          <ListConfirmationPreventiveSubmit
            list={list}
            navigation={navigation}
          />
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifConfirmSubmit;
