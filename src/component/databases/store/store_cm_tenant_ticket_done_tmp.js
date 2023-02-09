import GetLocation from 'react-native-get-location';
import BackgroundJob from 'react-native-background-job';
import {Alert} from 'react-native';
import {APIService} from '../../../services';
import {command} from '../../chalk';

export const store_cm_tenant_ticket_done = (db, params) => {
  const storeAjax = async (data, longitude, latitude) => {
    try {
      const res = await APIService.submitUpdateStatusCorrective(params);
      if (res.data.message == 'success') {
        BackgroundJob.cancel({
          jobKey: 'wait_sending_ticket_done',
        });
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE cm_tenant_ticket_tmp SET status_job = "sending" WHERE tenant_ticket_id = ?',
            [data.tenant_ticket_id],
            (tx, result) => {
              command.green('update cm_tenant_ticket_tmp id successfully');
            },
            error => {
              command.red('error on update item ' + error.message);
            },
          );
        });
        return true;
      } else {
        BackgroundJob.cancel({
          jobKey: 'wait_sending_ticket_done',
        });
        Alert.alert('error', 'Data not process');
      }
    } catch (error) {
      command.red(error.message);
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
              command.red(code, message);
            });
        }
        command.green('select table cm_tenant_ticket_tmp successfully');
      },
      error => {
        command.red(
          'error on select table cm_tenant_ticket_tmp ' + error.message,
        );
      },
    );
  });
};
