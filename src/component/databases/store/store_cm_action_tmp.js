import axios from 'axios';
import GetLocation from 'react-native-get-location';
import BackgroundJob from 'react-native-background-job';
import {Alert} from 'react-native';
import {CorrectiveAPIService} from '../../../services';

export const store_cm_action = (db, LoginReducer) => {
  const storeAjax = async (data, longitude, latitude) => {
    try {
      let uploadData = new FormData();
      if (data.attachment != null) {
        let photos_before = data.attachment.split(';;');
        photos_before.map(resources => {
          uploadData.append('file_before[]', {
            type: 'image/jpeg',
            uri: resources,
            name: resources.substring(resources.lastIndexOf('/') + 1),
          });
        });
      }

      if (data.attachment_after != null) {
        let photos_after = data.attachment_after.split(';;');
        photos_after.map(resources => {
          uploadData.append('file_after[]', {
            type: 'image/jpeg',
            uri: resources,
            name: resources.substring(resources.lastIndexOf('/') + 1),
          });
        });
      }
      uploadData.append('ticket', data.tenant_ticket_id);
      uploadData.append('time_taken', data.time_taken);
      uploadData.append('activity', data.description);
      uploadData.append('username', LoginReducer.form.profile.uid);
      uploadData.append('level', LoginReducer.form.profile.level);

      if (data.request_item == 1) {
        uploadData.append('request_item', 1);
        uploadData.append(
          'request_item_list',
          JSON.stringify(data.request_item_list),
        );
      } else {
        uploadData.append('request_item', 0);
      }
      const res = await CorrectiveAPIService.submitActivityTakenCorrective(
        uploadData,
      );
      if (res.data.message == 'success') {
        BackgroundJob.cancel({
          jobKey: 'wait_sending',
        });
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE cm_action_tmp SET status_job = "sending" WHERE tenant_ticket_id = ?',
            [data.tenant_ticket_id],
            (tx, result) => {
              console.log('update cm_action_tmp id successfully');
            },
            error => {
              console.log('error on update item ' + error.message);
            },
          );
        });
        return true;
      } else {
        BackgroundJob.cancel({
          jobKey: 'wait_sending',
        });
        Alert.alert('error', 'Data not save');
      }
    } catch (error) {
      console.log(error.message);
      //   BackgroundJob.cancel({
      //     jobKey: 'wait_sending',
      //   });
      //   Alert.alert('error', error.message);
      return false;
    }
  };

  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM cm_action_tmp WHERE status_job = ?',
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
        console.log('select table cm_action_tmp successfully');
      },
      error => {
        console.log('error on select table cm_action_tmp ' + error.message);
      },
    );
  });
};
