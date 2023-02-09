import {CorrectiveAPIService} from '../../../services';
import {command} from '../../chalk';
import {insert_cm_action_tmp} from '../insert/insert_cm_action';

export const fetch_cm_action = async (db, params) => {
  try {
    const data = {
      usernm: params.form.profile.uid,
      level: params.form.profile.level,
    };
    const res = await CorrectiveAPIService.fetchListAction(data);
    res.data.list.map(data => {
      insert_cm_action_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM cm_action_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          command.green('total data in cm_action_tmp : ' + res.rows.length);
          // console.table(temp);
        },
        error => {
          command.red('error on table cm_action_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on table cm_action_tmp ' + error.message);
  }
};
