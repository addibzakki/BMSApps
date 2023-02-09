import GlobalAPIService from '../../../services/Global/APIservice';
import {insert_gl_user_tmp} from '../insert/insert_gl_user_tmp';

export const fetch_gl_user = async (db, params) => {
  try {
    const res = await GlobalAPIService.fetchListUser();
    res.data.list.map(data => {
      insert_gl_user_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM gl_user_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          console.log('total data in gl_user_tmp : ' + res.rows.length);
          // console.table(temp);
        },
        error => {
          console.log('error on table gl_user_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    console.log('error on table gl_user_tmp ' + error.message);
  }
};
