import axios from 'axios';
import GetLocation from 'react-native-get-location';
import BackgroundJob from 'react-native-background-job';
import {Alert} from 'react-native';
import {inputTablesLog} from '../insert/index';
import {MeterAPIService} from '../../../services';

export const uploadTables = (db, params) => {
  const storeAjax = async (data, longitude, latitude) => {
    console.log(data);
    try {
      let uploadData = new FormData();
      let picture = data.attachment.split(';;');
      picture.map(resources => {
        uploadData.append('file[]', {
          type: 'image/jpeg',
          uri: resources,
          name: resources.substring(resources.lastIndexOf('/') + 1),
        });
      });
      let tenant_available;
      if (data.available == 1) {
        tenant_available = true;
      } else {
        tenant_available = false;
      }
      uploadData.append('meter_id', data.meter_id);
      uploadData.append('curr_read', data.curr_read);
      uploadData.append('curr_read_high', data.curr_read_high);
      uploadData.append('tenant_name', data.tenant_name);
      uploadData.append('signature', data.signature);
      uploadData.append('entity_cd', data.entity_cd);
      uploadData.append('project_no', data.project_no);
      uploadData.append('debtor_acct', data.debtor_acct);
      uploadData.append('debtor_name', data.debtor_name);
      uploadData.append('lot_no', data.lot_no);
      uploadData.append('read_by', data.read_by);
      uploadData.append('tenant_available', tenant_available);
      uploadData.append('longitude', longitude);
      uploadData.append('latitude', latitude);

      console.log(uploadData);

      const res = await MeterAPIService.createReadingMeter(uploadData);
      if (res.data.code == 200) {
        inputTablesLog(db, data, 'bms_meter_log', 'success');
        // Alert.alert('Success', response.data.message);
        console.log('insert into bms_meter successfully');
        BackgroundJob.cancel({
          jobKey: data.meter_id,
        });
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bms_meter_temp WHERE meter_id = ? AND entity_cd = ?',
            [data.meter_id, data.entity_cd],
            (tx, result) => {
              console.log('delete meter meter id successfully');
            },
            error => {
              console.log('error on delete item ' + error.message);
            },
          );
        });
        return true;
      } else if (res.data.code == 300) {
        inputTablesLog(db, data, 'bms_meter_log', 'duplicate');
        // Alert.alert('Attention', response.data.message);
        console.log('delete duplicate bms_meter successfully');
        BackgroundJob.cancel({
          jobKey: data.meter_id,
        });
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bms_meter_temp WHERE meter_id = ? AND entity_cd = ?',
            [data.meter_id, data.entity_cd],
            (tx, result) => {
              console.log('delete meter meter id successfully');
            },
            error => {
              console.log('error on delete item ' + error.message);
            },
          );
        });
        return false;
      } else {
        inputTablesLog(db, data, 'bms_meter_log', 'error');
        BackgroundJob.cancel({
          jobKey: data.meter_id,
        });
        Alert.alert('Error', res.data.message);
        console.log('error :' + 'Submit meter recording failed');
        return false;
      }
    } catch (error) {
      inputTablesLog(db, data, 'bms_meter_log', 'error connection');
      console.log(error);
      Alert.alert('Error', error.message);
    }
    // end push
  };

  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM bms_meter_temp WHERE meter_id = ? AND entity_cd = ?',
      params,
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
        console.log('select table bms_meter_temp successfully');
      },
      error => {
        console.log('error on select table bms_meter_temp ' + error.message);
      },
    );
  });
};

export const uploadPendingTables = db => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM bms_meter_temp',
      [],
      (txn, res) => {
        for (let i = 0; i < res.rows.length; ++i) {
          const source = axios.CancelToken.source();
          const timeout = setTimeout(() => {
            source.cancel('ECONNABORTED');
            // Timeout Logic
          }, 5000);
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(async location => {
              try {
                let uploadData = new FormData();
                let picture = res.rows.item(i).attachment.split(';;');
                picture.map(resources => {
                  uploadData.append('file[]', {
                    type: 'image/jpeg',
                    uri: resources,
                    name: resources.substring(resources.lastIndexOf('/') + 1),
                  });
                });
                let tenant_available;
                if (res.rows.item(i).available == 1) {
                  tenant_available = true;
                } else {
                  tenant_available = false;
                }
                uploadData.append('meter_id', res.rows.item(i).meter_id);
                uploadData.append('curr_read', res.rows.item(i).curr_read);
                uploadData.append(
                  'curr_read_high',
                  res.rows.item(i).curr_read_high,
                );
                uploadData.append('tenant_name', res.rows.item(i).tenant_name);
                uploadData.append('signature', res.rows.item(i).signature);
                uploadData.append('entity_cd', res.rows.item(i).entity_cd);
                uploadData.append('project_no', res.rows.item(i).project_no);
                uploadData.append('debtor_acct', res.rows.item(i).debtor_acct);
                uploadData.append('debtor_name', res.rows.item(i).debtor_name);
                uploadData.append('lot_no', res.rows.item(i).lot_no);
                uploadData.append('read_by', res.rows.item(i).read_by);
                uploadData.append('tenant_available', tenant_available);
                uploadData.append('longitude', location.longitude);
                uploadData.append('latitude', location.latitude);
                  console.log(uploadData);
                const resp = await MeterAPIService.createReadingMeter(
                  uploadData,
                );
                if (resp.data.code == 200) {
                  console.log('insert into bms_meter successfully');
                  BackgroundJob.cancel({
                    jobKey: res.rows.item(i).meter_id,
                  });
                  db.transaction(tx => {
                    tx.executeSql(
                      'DELETE FROM bms_meter_temp WHERE meter_id = ? AND entity_cd = ?',
                      [res.rows.item(i).meter_id, res.rows.item(i).entity_cd],
                      (tx, result) => {
                        console.log('delete meter meter id successfully');
                      },
                      error => {
                        console.log('error on delete item ' + error.message);
                      },
                    );
                  });
                  return true;
                } else if (resp.data.code == 300) {
                  console.log('error :' + resp.data.message);
                  return false;
                } else {
                  Alert.alert('Error', resp.data.message);
                  console.log('error :' + 'Submit meter recording failed');
                  return false;
                }
              } catch (error) {
                console.log(error);
                Alert.alert('Error', error.message);
                return false;
              }

              // end push
            })
            .catch(error => {
              const {code, message} = error;
              // console.warn(code, message);
              console.log(code, message);
            });
        }
        console.log('select table bms_meter_temp successfully');
      },
      error => {
        console.log('error on select table bms_meter_temp ' + error.message);
      },
    );
  });
};



export const uploadTablesMaster = (db, params) => {
  const storeAjax = async (data) => {
    console.log(data);
    try {
      let uploadData = new FormData();
      uploadData.append('entity_cd', data.entity_cd);
      uploadData.append('db_identity', data.db_identity);
      uploadData.append('project_no', data.project_no);
      uploadData.append('meter_cd', data.meter_cd);
      uploadData.append('month', data.month);
      uploadData.append('year', data.year);
      uploadData.append('status', data.status);
      uploadData.append('shape', data.shape);
      uploadData.append('length', data.length);
      uploadData.append('diameter', data.diameter);
      uploadData.append('width', data.width);
      uploadData.append('height', data.height);
      uploadData.append('volume', data.volume);
      uploadData.append('clean_water_rate', data.clean_water_rate);
      uploadData.append('dirty_water_rate', data.dirty_water_rate);
      uploadData.append('dirty_water_usage', data.dirty_water_usage);
      uploadData.append('read_by', data.read_by);
      uploadData.append('read_date', data.read_date);

      console.log(uploadData);

      const res = await MeterAPIService.createReadingMeterMaster(uploadData);
      if (res.data.code == 200) {
        // Alert.alert('Success', response.data.message);
        console.log('insert into bms_meter_fasum_water_trx_volume successfully');
        BackgroundJob.cancel({
          jobKey: data.meter_cd,
        });
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bms_volume_trx_temp WHERE meter_cd = ? AND entity_cd = ? AND project_no = ?',
            [data.meter_cd, data.entity_cd, data.project_no],
            (tx, result) => {
              console.log('delete meter meter cd successfully');
            },
            error => {
              console.log('error on delete item ' + error.message);
            },
          );
        });
        return true;
      } else if (res.data.code == 300) {
        // Alert.alert('Attention', response.data.message);
        console.log('delete duplicate bms_volume_trx_temp successfully');
        BackgroundJob.cancel({
          jobKey: data.meter_cd,
        });
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bms_volume_trx_temp WHERE meter_cd = ? AND entity_cd = ? AND project_no = ?',
            [data.meter_cd, data.entity_cd, data.prject_no],
            (tx, result) => {
              console.log('delete meter cd successfully');
            },
            error => {
              console.log('error on delete item ' + error.message);
            },
          );
        });
        return false;
      } else {
        BackgroundJob.cancel({
          jobKey: data.meter_cd,
        });
        // Alert.alert('Error', res.data.message);
        console.log('error :' + 'Submit meter recording failed');
        return false;
      }
    } catch (error) {
      // inputTablesLog(db, data, 'bms_meter_log', 'error connection');
      console.log(error);
      // Alert.alert('Error', error.message);
    }
    // end push
  };

  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM bms_volume_trx_temp WHERE meter_cd = ? AND entity_cd = ? AND project_no = ?',
      params,
      (txn, res) => {
        for (let i = 0; i < res.rows.length; ++i) {
          storeAjax(
            res.rows.item(i),
          );
        }
        console.log('select table bms_volume_trx_temp successfully');
      },
      error => {
        console.log('error on select table bms_volume_trx_temp ' + error.message);
      },
    );
  });
};