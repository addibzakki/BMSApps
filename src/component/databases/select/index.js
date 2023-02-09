import {command} from '../../chalk';

export const selectTables = db => {
  var temp = [];
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM list_meter',
      [],
      (txn, res) => {
        for (let i = 0; i < res.rows.length; ++i) {
          temp.push(res.rows.item(i));
        }
        setFlatListItems(temp);
        command.green('select table successfully');
      },
      error => {
        command.red('error on select table list_meter ' + error.message);
      },
    );
  });
};
