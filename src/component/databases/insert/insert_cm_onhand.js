import {command} from '../../chalk';

export const insert_cm_onhand_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO cm_onhand_tmp (entity_project, entity_cd, item_cd, onhand_qty) VALUES (?, ?, ?, ?)',
        [data.entity_project, data.entity_cd, data.item_cd, data.onhand_qty],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.green('insert table cm_onhand_tmp successfully');
          }
        },
        error => {
          command.red('error on insert table cm_onhand_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on insert table cm_onhand_tmp ' + error.message);
  }
};
