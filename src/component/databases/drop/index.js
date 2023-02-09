export const dropTable = (db, table) => {
  db.transaction(txn => {
    txn.executeSql(
      'DROP TABLE IF EXISTS ' + table,
      [],
      (txn, res) => {
        console.log('table drop successfully');
      },
      error => {
        console.log('error on drop table : ' + error.message);
      },
    );
  });
};
