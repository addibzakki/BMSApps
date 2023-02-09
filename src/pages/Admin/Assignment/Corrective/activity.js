import React, {useContext, useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {
  TopHeader,
  ButtonActionFooter,
  ListActivity,
} from '../../../../component';
import {useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import moment from 'moment';
import GlobalContext from '../../../../component/GlobalContext';
import {cmd} from '../../../../component/chalk';

const AdminHelpdeskActivity = ({navigation}) => {
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [listActivity, setListActivity] = useState([]);
  const [status, setStatus] = useState('');
  const networkContext = useContext(GlobalContext);
  cmd.pink(
    'In page list activity with status_id : ' +
      CorrectiveReducer.ticket_status_id +
      ' & status_tenant : ' +
      CorrectiveReducer.ticket_status_tenant,
  );

  useEffect(() => {
    getData();
  }, [navigation, networkContext.networkInfo, GlobalReducer.refresh == true]);

  const getData = async () => {
    try {
      if (networkContext.networkInfo == true) {
        cmd.green('Network : Ok');
        setTimeout(async () => {
          const res = await CorrectiveAPIService.getListActivityCorrective(
            CorrectiveReducer.ticket_no,
          );
          setStatus(res.data.status);
          setListActivity(res.data.list);
        }, 2000);
      } else {
        cmd.red('Network : Not Ok');
        var temp = [];
        db.transaction(txn => {
          txn.executeSql(
            'SELECT a.*, b.emp_name, b.emp_photo FROM cm_action_tmp a LEFT JOIN gl_user_tmp b ON a.engineering_username = b.username WHERE a.tenant_ticket_id = ? ORDER BY created_date DESC',
            [CorrectiveReducer.ticket_no],
            (txn, res) => {
              for (let i = 0; i < res.rows.length; ++i) {
                temp.push({
                  runID: res.rows.item(i)['runID'],
                  username: res.rows.item(i)['emp_name'],
                  engineering_username: res.rows.item(i)[
                    'engineering_username'
                  ],
                  description: res.rows.item(i)['description'],
                  time_taken:
                    moment(res.rows.item(i)['created_date']).format(
                      'YYYY-MM-DD',
                    ) +
                    ' ' +
                    res.rows.item(i)['time_taken'],
                  created_date: res.rows.item(i)['created_date'],
                  attachment: res.rows.item(i)['attachment'],
                  attachment_after: res.rows.item(i)['attachment_after'],
                  request_item: res.rows.item(i)['request_item'],
                  request_item_description: res.rows.item(i)[
                    'request_item_description'
                  ],
                  status_id: res.rows.item(i)['status_id'],
                  photo: res.rows.item(i)['emp_photo'],
                  confirm_item: res.rows.item(i)['confirm_item'],
                });
              }
              setListActivity(temp);
              if (res.rows.length > 0) {
                txn.executeSql(
                  'SELECT distinct status_id FROM cm_action_tmp WHERE tenant_ticket_id = ?',
                  [CorrectiveReducer.ticket_no],
                  (txn, res) => {
                    setStatus(res.rows.item(0)['status_id']);
                  },
                  error => {
                    console.log(
                      'error on insert table cm_action_tmp ' + error.message,
                    );
                    Alert.alert('error', 'Submit action recording failed');
                    setLoading(false);
                  },
                );
              } else {
                setStatus(1);
              }
            },
            error => {
              console.log(
                'error on select table cm_tenant_ticket_tmp ' + error.message,
              );
            },
          );
        });
      }
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={GlobalReducer.loading}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={CorrectiveReducer.ticket_no}
        subTitle="List Activity"
        onPress={() => navigation.replace('AdminHelpdeskShow')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={(global_style.content, {flex: 1})}>
          <ListActivity
            list={listActivity}
            status={status}
            navigation={navigation}
          />
          <ButtonActionFooter navigation={navigation} />
        </View>
      </View>
    </View>
  );
};

export default AdminHelpdeskActivity;
