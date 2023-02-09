import GlobalAPIService from '../../../services/Global/APIservice';
import {insert_gl_area_tmp} from '../insert/insert_gl_area_tmp';

export const fetch_gl_area = async db => {
  try {
    const res = await GlobalAPIService.fetchListWorkArea();
    res.data.list.map(data => {
      insert_gl_area_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM gl_area_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          console.log('total data in gl_area_tmp : ' + res.rows.length);
          // console.table(temp);
        },
        error => {
          console.log('error on table gl_area_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    console.log('error on table gl_area_tmp ' + error.message);
  }
};
