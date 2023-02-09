import {command} from '../../chalk';

export const db_gl_area_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='gl_area_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS gl_area_tmp(workArea int NULL, project_no varchar(10) NULL, username varchar(50) NULL, scanDate datetime NULL, checkOutDate datetime NULL, longitude varchar(50) NULL, latitude varchar(50) NULL, photo varchar(255) NULL);' +
                'CREATE UNIQUE INDEX id_UNIQUE ON gl_area_tmp (workArea, project_no, username, scanDate, checkOutDate, longitude, latitude, photo)',
              [],
              (txt, rest) => {
                command.yellow('create table gl_area_tmp created successfully');
              },
              error => {
                command.red(
                  'error on create table gl_area_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    command.red('table gl_area_tmp error ' + error.message);
  }
};
