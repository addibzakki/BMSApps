import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ActionButton} from '../../../ActionButton';
import {InputForm, InputTime} from '../../../../../component';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {global_style} from '../../../../../styles';
import {
  setTicketStatusIDCorrective,
  setTicketStatusTenantCorrective,
} from '../../../../../redux';
import {CorrectiveAPIService} from '../../../../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import BackgroundJob from 'react-native-background-job';
import {store_cm_action} from '../../../../../component/databases/store/store_cm_action_tmp';
import GlobalContext from '../../../../../component/GlobalContext';
import {sendNotificationOneSignal} from '../../../../../component';

const FormNote = props => {
  console.log('in form take note corrective');
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const [showTime, setShowTime] = useState(false);
  const [timeTaken, setTimeTaken] = useState(moment().toDate());
  const [activity, setActivity] = useState('');
  const full_date =
    days[new Date().getDay()] + ', ' + moment().format('DD MMMM Y');
  const [loading, setLoading] = useState(false);
  const networkContext = useContext(GlobalContext);

  BackgroundJob.register({
    jobKey: 'wait_sending',
    job: () => {
      store_cm_action(db, LoginReducer);
      console.log('Background Job fired for : All job pending');
    },
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
    });
    return unsubscribe;
  }, [props]);

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || timeTaken;
    setShowTime(Platform.OS == 'ios');
    setTimeTaken(currentDate);
  };

  const HandleSubmitActivity = () => {
    if (activity == '') {
      Alert.alert('Error', 'Please fill in the activity field');
    } else {
      submitActivity();
    }
  };

  const transmitData = () => {
    BackgroundJob.schedule({
      period: 2000,
      allowExecutionInForeground: true,
      exact: true,
      networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
      notificationText: 'Process post action running in background',
      notificationTitle: 'Building Management System',
      jobKey: 'wait_sending',
    });
  };

  const submitActivity = async () => {
    try {
      if (networkContext.networkInfo == true) {
        setLoading(true);
        let uploadData = new FormData();
        uploadData.append('ticket', CorrectiveReducer.ticket_no);
        uploadData.append('activity', 'Release to on progress : ' + activity);
        uploadData.append('time_taken', moment(timeTaken).format('HH:mm'));
        uploadData.append('username', LoginReducer.form.profile.uid);
        uploadData.append('level', LoginReducer.form.profile.level);
        uploadData.append('request_item', 0);
        uploadData.append('activityType', CorrectiveReducer.type);

        const res = await CorrectiveAPIService.submitActivityTakenCorrective(
          uploadData,
        );
        if (res.data.message == 'success') {
          sendNotificationOneSignal(
            res.data.notification.subtitle,
            res.data.notification.activity,
            res.data.player_ids,
          );
          setLoading(false);
          dispatch(
            setTicketStatusIDCorrective(
              res.data.status == 'error'
                ? CorrectiveReducer.ticket_status_id
                : res.data.status,
            ),
          );
          dispatch(
            setTicketStatusTenantCorrective(
              res.data.status_tenant == 'error'
                ? CorrectiveReducer.ticket_status_tenant
                : res.data.status_tenant,
            ),
          );
          props.navigation.replace('AdminHelpdeskActivity');
        } else {
          Alert.alert('error', 'Data not save');
          setLoading(false);
        }
      } else {
        setLoading(true);
        db.transaction(txn => {
          txn.executeSql(
            'INSERT INTO cm_action_tmp (tenant_ticket_id,engineering_username,description,attachment,attachment_after,status_id,time_taken,request_item, status_job) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              CorrectiveReducer.ticket_no,
              LoginReducer.form.profile.uid,
              activity,
              null,
              null,
              2,
              moment(timeTaken).format('HH:mm'),
              0,
              'waiting',
            ],
            (txn, res) => {
              if (res.rowsAffected > 0) {
                txn.executeSql(
                  'SELECT status_id, status_tenant FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?',
                  [CorrectiveReducer.ticket_no],
                  (txn, res) => {
                    dispatch(
                      setTicketStatusIDCorrective(
                        res.rows.item(0)['status_id'],
                      ),
                    );
                    dispatch(
                      setTicketStatusTenantCorrective(
                        res.rows.item(0)['status_tenant'],
                      ),
                    );
                    transmitData();
                    setLoading(false);
                    props.navigation.replace('AdminHelpdeskActivity');
                  },
                  error => {
                    console.log(
                      'error on insert table cm_action_tmp ' + error.message,
                    );
                    Alert.alert('error', 'Submit action recording failed');
                    setLoading(false);
                  },
                );

                console.log('Data action has been record');
              }
            },
            error => {
              console.log(
                'error on insert table cm_action_tmp ' + error.message,
              );
              Alert.alert('error', 'Submit meter recording failed');
              setLoading(false);
            },
          );
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={global_style.sub_page}>
      <Spinner
        visible={loading}
        textContent={'Submiting Activity...'}
        textStyle={{color: '#FFF'}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={global_style.content}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '65%'}}>
              <InputForm
                placeholder="date"
                value={full_date}
                editable={false}
              />
            </View>
            <View style={{width: '30%'}}>
              <InputTime
                placeholder="time taken"
                value={timeTaken ? moment(timeTaken).format('HH:mm') : ''}
                editable={false}
                onPress={() => setShowTime(true)}
              />
              {showTime && (
                <DateTimePicker
                  testID="startTimePicker"
                  value={timeTaken}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeTime}
                />
              )}
            </View>
          </View>
          <InputForm
            placeholder="note"
            value={activity}
            multiline={true}
            onChangeText={value => setActivity(value)}
          />
        </View>
        <View style={{marginBottom: 10}}>
          <ActionButton title="Submit" onPress={() => HandleSubmitActivity()} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FormNote;
