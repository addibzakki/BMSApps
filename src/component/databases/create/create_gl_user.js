import {command} from '../../chalk';

export const db_gl_user_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='gl_user_tmp'",
        [],
        function(tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS gl_user_tmp(username varchar(150) PRIMARY KEY, emp_division_id int, emp_name varchar(100) NULL, emp_job_position varchar(100) NULL, emp_photo varchar(255) NULL, CONSTRAINT id_unique UNIQUE(emp_division_id, emp_name, emp_job_position, emp_photo))',
              [],
              (txt, rest) => {
                command.yellow('create table gl_user_tmp created successfully');
              },
              error => {
                command.red(
                  'error on create table gl_user_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    command.red('table gl_user_tmp error : ' + error.message);
  }
};
