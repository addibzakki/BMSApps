import CorrectiveAPIService from '../../../services/Corrective/APIservice';
import {command} from '../../chalk';
import {insert_cm_assignment_pic_tmp} from '../insert/insert_cm_assignment_pic';

export const fetch_cm_assignment_pic = async db => {
  try {
    const res = await CorrectiveAPIService.fetchListAssignmentPIC();
    res.data.list.map(data => {
      insert_cm_assignment_pic_tmp(db, data);
    });
    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM cm_assignment_pic_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          command.cyan(
            'total data in cm_assignment_pic_tmp : ' + res.rows.length,
          );
        },
        error => {
          command.red('error on table cm_assignment_pic_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on table cm_assignment_pic_tmp ' + error.message);
  }
};
