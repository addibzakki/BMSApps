import React, {useEffect} from 'react';
import {View, Alert} from 'react-native';
import {SubMenuCorrective, TopHeader} from '../../../../component';
import {useDispatch, useSelector} from 'react-redux';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {setListMenuCorrective, setRefresh} from '../../../../redux';
import {fetch_cm_action} from '../../../../component/databases/combinations/combination_cm_action';

const AdminHelpdesk = ({navigation}) => {
  console.log('in menu corrective by status');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);

  useEffect(() => {
    // when focused true
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      fetch_cm_action(db, LoginReducer);
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh === true]);

  const getData = async () => {
    try {
      const params = {
        username: LoginReducer.form.profile.uid,
        level: LoginReducer.form.profile.level,
      };
      const res = await CorrectiveAPIService.getSubMenuTicket(params);
      dispatch(setListMenuCorrective([...res.data]));
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert(error.message);
      dispatch(setRefresh(false));
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Assignment"
        subTitle="Ticket Status"
        onPress={() => navigation.navigate('AdminAssignment')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <SubMenuCorrective navigation={navigation} />
      </View>
    </View>
  );
};

export default AdminHelpdesk;
