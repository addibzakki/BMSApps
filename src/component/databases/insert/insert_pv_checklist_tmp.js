export const insert_pv_checklist_tmp = (db, data) => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM pv_checklist_tmp WHERE id = ? AND transaksi_preventive_maintenance_id = ?',
      [data.id, data.transaksi_preventive_maintenance_id],
      function(tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql(
            'INSERT OR IGNORE INTO pv_checklist_tmp (id, transaksi_preventive_maintenance_id, name, description, status_id, status_name, status_color, total_check_standard) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              data.id,
              data.transaksi_preventive_maintenance_id,
              data.name,
              data.description,
              data.status_id,
              data.status_name,
              data.status_color,
              data.total_check_standard,
            ],
            (txn, res) => {
              if (res.rowsAffected > 0) {
                //console.log('insert table pv_checklsit_tmp successfully');
              }
            },
            error => {
              console.log(
                'error on insert table pv_checklsit_tmp ' + error.message,
              );
            },
          );
        }
      },
    );
  });
};
