import {CorrectiveAPIService} from '../../../services';
import {insert_cm_onhand_tmp} from '../insert/insert_cm_onhand';

export const fetch_cm_onhand = async (db, params) => {
  try {
    const res = await CorrectiveAPIService.fetchListOnHand();
    res.data.list.map(data => {
      insert_cm_onhand_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM cm_onhand_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          console.log('total data in cm_onhand_tmp : ' + res.rows.length);
          // console.table(temp);
        },
        error => {
          console.log('error on table cm_onhand_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    console.log('error on table cm_onhand_tmp ' + error.message);
  }
};
