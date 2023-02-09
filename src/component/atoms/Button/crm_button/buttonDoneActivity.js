import React, {useContext} from 'react';
import {Text, Alert} from 'react-native';
import {Button} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../../../../redux';
import {CorrectiveAPIService} from '../../../../services';
import {RFPercentage} from 'react-native-responsive-fontsize';
import BackgroundJob from 'react-native-background-job';
import {store_cm_tenant_ticket_done} from '../../../databases/store/store_cm_tenant_ticket_done_tmp';
import GlobalContext from '../../../GlobalContext';
import {sendNotificationOneSignal} from '../../../notification/index';

export const ButtonDoneActivity = props => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const networkContext = useContext(GlobalContext);

  BackgroundJob.register({
    jobKey: 'wait_sending_ticket_done',
    job: () => {
      const params = {
        type: 'action-taken',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 4,
      };
      store_cm_tenant_ticket_done(db, params);
      console.log('Background Job fired for : All job pending');
    },
  });

  const transmitData = () => {
    BackgroundJob.schedule({
      period: 10000,
      allowExecutionInForeground: true,
      exact: true,
      networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
      notificationText: 'Process post action running in background',
      notificationTitle: 'Building Management System',
      jobKey: 'wait_sending_ticket_done',
    });
  };

  const handleDoneActivity = async () => {
    try {
      dispatch(setLoading(true));
      const params = {
        type: 'action-taken',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 4,
      };
      const res = await CorrectiveAPIService.submitUpdateStatusCorrective(
        params,
      );
      if (res.data.message == 'success') {
        dispatch(setLoading(false));
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        props.navigation.replace('AdminHelpdeskDashboard');
      } else {
        dispatch(setLoading(false));
        Alert.alert(
          'Error',
          'Something wrong with status : ' + res.data.message,
        );
      }
      // db.transaction(txn => {
      //   txn.executeSql(
      //     'UPDATE cm_tenant_ticket_tmp SET status_id = 4, status_tenant = 6, status_job = "waiting" WHERE tenant_ticket_id = ?',
      //     [CorrectiveReducer.ticket_no],
      //     (txn, res) => {
      //       if (res.rowsAffected > 0) {
      //         console.log('update cm_action_tmp id successfully');
      //         txn.executeSql(
      //           'SELECT status_id, status_tenant FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?',
      //           [CorrectiveReducer.ticket_no],
      //           (txn, res) => {
      //             dispatch(
      //               setTicketStatusIDCorrective(res.rows.item(0)['status_id']),
      //             );
      //             dispatch(
      //               setTicketStatusTenantCorrective(
      //                 res.rows.item(0)['status_tenant'],
      //               ),
      //             );
      //             // dispatch(setRefresh(true));
      //             dispatch(setLoading(false));
      //             transmitData();
      //           },
      //           error => {
      //             console.log(
      //               'error on insert table cm_action_tmp ' + error.message,
      //             );
      //             Alert.alert('error', 'Submit action recording failed');
      //             dispatch(setLoading(false));
      //           },
      //         );
      //       }
      //     },
      //     error => {
      //       console.log('error on update item ' + error.message);
      //     },
      //   );
      // });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const confirmDoneActivity = () => {
    Alert.alert('Confirmation!', 'Are you sure this ticket has complete?', [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {text: 'Yes, Sure!', onPress: () => handleDoneActivity()},
    ]);
  };

  return (
    <Button
      success
      full
      onPress={() => {
        if (networkContext.networkInfo == false) {
          Alert.alert(
            'Attention',
            'Sorry, please use a good network to access this feature',
          );
        } else {
          confirmDoneActivity();
        }
      }}>
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2.5),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Done
      </Text>
    </Button>
  );
};
