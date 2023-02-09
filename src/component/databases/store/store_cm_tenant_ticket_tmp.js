import axios from 'axios';
import GetLocation from 'react-native-get-location';
import BackgroundJob from 'react-native-background-job';
import {Alert} from 'react-native';
import {CorrectiveAPIService} from '../../../services';

export const store_cm_tenant_ticket = (db, params) => {
  const storeAjax = async (data, longitude, latitude) => {
    try {
      const res = await CorrectiveAPIService.submitUpdateStatusCorrective(
        params,
      );
      if (res.data.message == 'success') {
        BackgroundJob.cancel({
          jobKey: 'wait_sending_ticket',
        });
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE cm_tenant_ticket_tmp SET status_job = "sending" WHERE tenant_ticket_id = ?',
            [data.tenant_ticket_id],
            (tx, result) => {
              console.log('update cm_tenant_ticket_tmp id successfully');
            },
            error => {
              console.log('error on update item ' + error.message);
            },
          );
        });
        return true;
      } else {
        BackgroundJob.cancel({
          jobKey: 'wait_sending_ticket',
        });
        Alert.alert('error', 'Data not process');
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM cm_tenant_ticket_tmp WHERE status_job = ?',
      ['waiting'],
      (txn, res) => {
        for (let i = 0; i < res.rows.length; ++i) {
          GetLocation.getCurrentPosition({
            // enableHighAccuracy: true,
            timeout: 20000,
          })
            .then(location => {
              storeAjax(
                res.rows.item(i),
                location.longitude,
                location.latitude,
              );
            })
            .catch(error => {
              storeAjax(res.rows.item(i), 0, 0);
              const {code, message} = error;
              // console.warn(code, message);
              console.log(code, message);
            });
        }
        console.log('select table cm_tenant_ticket_tmp successfully');
      },
      error => {
        console.log(
          'error on select table cm_tenant_ticket_tmp ' + error.message,
        );
      },
    );
  });
};
