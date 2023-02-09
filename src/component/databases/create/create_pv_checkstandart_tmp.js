export const db_pv_checkstandart_tmp = db => {
  db.transaction(function(txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='pv_checkstandart_tmp'",
      [],
      function(tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS pv_checkstandart_tmp(rowID INTEGER PRIMARY KEY AUTOINCREMENT, id int, id_checklist int, status int NULL, remark TEXT NULL, images varchar(255) NULL, task_name varchar(255) NULL, task_description varchar(255) NULL, image_required INT NULL, task_id int, required INT NULL, process INT NULL, transaksi_preventive_maintenance_id int, status_option varchar(255) NULL, video_required INT NULL)',
            [],
          );
          console.log('table pv_checkstandart_tmp created successfully');
        }
      },
    );
  });
};
