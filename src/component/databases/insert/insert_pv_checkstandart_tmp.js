export const insert_pv_checkstandart_tmp = (db, data) => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM pv_checkstandart_tmp WHERE id = ? AND task_id = ?',
      [data.id, data.task_id],
      function(tx, res) {
        if (res.rows.length === 0) {
          txn.executeSql(
            'INSERT OR IGNORE INTO pv_checkstandart_tmp (id, id_checklist, status, remark, images, task_name, task_description, image_required, video_required, task_id, required, process, transaksi_preventive_maintenance_id, status_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              data.id,
              data.id_checklist,
              data.status,
              data.remark,
              data.images,
              data.task_name,
              data.task_description,
              data.image_required,
              data.video_required,
              data.task_id,
              data.required,
              data.status != null ? 1 : 0,
              data.transaksi_preventive_maintenance_id,
              data.status_option,
            ],
            (txn, res) => {
              // if (res.rowsAffected > 0) {
              //   console.log('insert table pv_checkstandart_tmp successfully');
              // } else {
              //   console.log('miss');
              // }
            },
            error => {
              console.log(
                'error on insert table pv_checkstandart_tmp ' + error.message,
              );
            },
          );
        } else {
          console.log('not found');
        }
      },
    );
  });
};
