import {command} from '../../chalk';

export const insert_cm_item_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR IGNORE INTO cm_item_tmp(item_cd, descs_mobile, uom) VALUES (?, ?, ?)',
        [data.item_cd, data.descs_mobile, data.uom],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.green('insert table cm_item_tmp successfully');
          }
        },
        error => {
          command.red('error on insert table cm_item_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on insert table cm_item_tmp ' + error.message);
  }
};
