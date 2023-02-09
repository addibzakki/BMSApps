export const db_cm_onhand_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cm_onhand_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cm_onhand_tmp(entity_project INTEGER PRIMARY KEY, entity_cd varchar(4) NULL, item_cd varchar(20) NULL, onhand_qty decimal(12,4),' +
                'CONSTRAINT id_unique UNIQUE(onhand_qty))',
              [],
              (txt, rest) => {
                console.log('create table cm_onhand_tmp created successfully');
              },
              error => {
                console.log(
                  'error on create table cm_onhand_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    console.log('error on create table cm_onhand_tmp ' + error.message);
  }
};
