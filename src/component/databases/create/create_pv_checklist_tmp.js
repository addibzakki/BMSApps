export const db_pv_checklist_tmp = db => {
  db.transaction(function(txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='pv_checklist_tmp'",
      [],
      function(tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS pv_checklist_tmp(rowID INTEGER PRIMARY KEY AUTOINCREMENT, id int, transaksi_preventive_maintenance_id int NULL, name varchar(255) NULL, description varchar(255) NULL, status_id int, status_name varchar(100) NULL, status_color varchar(10) NULL, total_check_standard int)',
            [],
          );
          console.log('table pv_checklist_tmp created successfully');
        }
      },
    );
  });
};
