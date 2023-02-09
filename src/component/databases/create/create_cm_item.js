export const db_cm_item_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cm_item_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cm_item_tmp(item_cd varchar(20) PRIMARY KEY, descs_mobile varchar(255), uom varchar(4) NULL, UNIQUE (descs_mobile, uom) ON CONFLICT IGNORE)',
              [],
              (txt, rest) => {
                console.log('create table cm_item_tmp created successfully');
              },
              error => {
                console.log(
                  'error on create table cm_item_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    console.log('error on create table cm_item_tmp ' + error.message);
  }
};
