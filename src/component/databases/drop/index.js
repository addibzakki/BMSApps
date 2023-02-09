import {command} from '../../chalk';
export const dropTable = (db, table) => {
  db.transaction(txn => {
    txn.executeSql(
      'DROP TABLE IF EXISTS ' + table,
      [],
      (txn, res) => {
        command.green('drop table ' + table + ' successfully');
      },
      error => {
        command.red('error on drop table : ' + error.message);
      },
    );
  });
};
