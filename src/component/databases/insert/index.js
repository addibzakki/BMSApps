export const inputTables = (db, data, table) => {
  db.transaction(txn => {
    if (table == 'bms_meter') {
      txn.executeSql(
        'INSERT OR IGNORE INTO bms_meter (entity_cd, meter_id, curr_read_date, read_by) VALUES (?, ?, ?, ?)',
        [data.entity_cd, data.meter_id, data.curr_read_date, data.read_by],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // console.log('insert table bms_meter successfully');
          }
        },
        error => {
          console.log('error on insert table bms_meter ' + error.message);
        },
      );
    } else {
      txn.executeSql(
        'INSERT OR IGNORE INTO list_meter (entity_cd,lot_no,project_no,debtor_acct,debtor_name,meter_id,read_date,last_read,last_read_high,business_id,ref_no) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [
          data.entity_cd,
          data.lot_no,
          data.project_no.trim(),
          data.debtor_acct,
          data.debtor_name,
          data.meter_id,
          data.read_date,
          data.last_read,
          data.last_read_high,
          data.business_id,
          data.ref_no,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // console.log('insert table list_meter successfully');
          }
        },
        error => {
          console.log('error on insert table list_meter ' + error.message);
        },
      );
    }
  });
};

export const inputTablesLog = (db, data, table, status) => {
  db.transaction(txn => {
    if (table === 'bms_meter_log') {
      txn.executeSql(
        'INSERT OR IGNORE INTO bms_meter_log (entity_cd, project_no, debtor_acct, lot_no, debtor_name, meter_id, curr_read_date, curr_read, curr_read_high, attachment, tenant_name, signature, read_by, available, status_trx) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.entity_cd,
          data.project_no,
          data.debtor_acct,
          data.lot_no,
          data.debtor_name,
          data.meter_id,
          data.curr_read_date,
          data.curr_read,
          data.curr_read_high,
          data.attachment,
          data.tenant_name,
          data.signature,
          data.read_by,
          data.available,
          status,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            console.log('insert table bms_meter_log successfully');
          }
        },
        error => {
          console.log('error on insert table bms_meter_log ' + error.message);
          Alert.alert('error', 'Submit meter log recording failed');
        },
      );
    }
  });
};
