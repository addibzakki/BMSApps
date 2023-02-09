import {CorrectiveAPIService} from '../../../services';
import {insert_cm_item_tmp} from '../insert/insert_cm_item';

export const fetch_cm_item = async (db, params) => {
  try {
    const res = await CorrectiveAPIService.fetchListItem();
    res.data.list.map(data => {
      insert_cm_item_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM cm_item_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          console.log('total data in cm_item_tmp : ' + res.rows.length);
          // console.table(temp);
        },
        error => {
          console.log('error on table cm_item_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    console.log('error on table cm_item_tmp ' + error.message);
  }
};
