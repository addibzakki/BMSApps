import {command} from '../../chalk';
export const deleteTables = (db, table, value) => {
  db.transaction(txn => {
    txn.executeSql(
      'DELETE FROM ' + table + ' WHERE meter_id = ? AND entity_cd = ?',
      value,
      (txn, res) => {
        command.green('delete item successfully');
      },
      error => {
        command.red('error on delete item : ' + error.message);
      },
    );
  });
};

export const deleteTablesDetailPreventif = (db, table, value) => {
  db.transaction(txn => {
    txn.executeSql(
      'DELETE FROM ' + table + ' WHERE id = ? AND trans_code = ?',
      value,
      (txn, res) => {
        command.green('delete preventif temp successfully');
      },
      error => {
        command.red('error on delete item : ' + error.message);
      },
    );
  });
};

export const deleteExpiredTables = db => {
  db.transaction(txn => {
    txn.executeSql(
      "DELETE FROM bms_meter WHERE curr_read_date <= date('now','-1 month')",
      [],
      (txn, res) => {
        if (res.rowsAffected > 0) {
          command.green('delete item expired bms_meter successfully');
        }
      },
      error => {
        command.red('error on delete item : ' + error.message);
      },
    );
    txn.executeSql(
      "DELETE FROM bms_meter_temp WHERE curr_read_date <= date('now','-1 month')",
      [],
      (txn, res) => {
        if (res.rowsAffected > 0) {
          command.green('delete item expired bms_meter_temp successfully');
        }
      },
      error => {
        command.red('error on delete item : ' + error.message);
      },
    );
    txn.executeSql(
      "DELETE FROM list_meter WHERE read_date <= date('now','-1 month')",
      [],
      (txn, res) => {
        if (res.rowsAffected > 0) {
          command.green('delete item expired list_meter successfully');
        }
      },
      error => {
        command.red('error on delete item : ' + error.message);
      },
    );
  });
};
