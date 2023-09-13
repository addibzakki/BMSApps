import React, { useEffect, useState } from 'react';
import {View, Alert} from 'react-native';
import {SubMenuCorrective, TopHeader} from '../../../../component';
import {useDispatch, useSelector} from 'react-redux';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {setListMenuCorrective, setRefresh} from '../../../../redux';
import {fetch_cm_action} from '../../../../component/databases/combinations/combination_cm_action';
import { Fab, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
// import { refresh_cm } from '../../../../component/databases/combinations/combination_cm_refresh';


const AdminHelpdesk = ({navigation}) => {
  console.log('in menu corrective by status');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);

  const [loadingProcess, setLoadingProcess] = useState(false);
  const [titleProcess, setTitleProcess] = useState('');

  useEffect(() => {
    // when focused true
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      fetch_cm_action(db, LoginReducer);
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh == true]);
  const changeModal = (set, title = '') => {
    setLoadingProcess(set);
    setTitleProcess(title);
  };
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

  const refreshCollection = () => {
    Alert.alert(
      'Attention',
      'Are you sure want to update data on local storage?',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => {
            changeModal(true, 'Data reloaded, please wait..');
            // refresh_cm(db, LoginReducer);
            changeModal(false);
          },
        },
      ],
    );
  };
  return (
    <View style={global_style.page}>
      <Spinner
        visible={loadingProcess}
        textContent={titleProcess}
        textStyle={{ color: '#FFF' }}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <TopHeader
        title="Assignment"
        subTitle="Ticket Status"
        onPress={() => navigation.navigate('AdminAssignment')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <SubMenuCorrective navigation={navigation} />
      </View>
      <Fab
        active={true}
        containerStyle={{}}
        style={{ backgroundColor: 'orange' }}
        position="bottomRight"
        onPress={() => refreshCollection()}>
        <Icon name="refresh-outline" />
      </Fab>
    </View>
  );
};

export default AdminHelpdesk;
