import {command} from '../../chalk';

export const db_cm_assignment_pic_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cm_assignment_pic_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cm_assignment_pic_tmp(tenant_ticket_id varchar(50) PRIMARY KEY, assignment_seq varchar(5), engineer_username varchar(250), assignment_from varchar(50) NULL, assignment_response datetime NULL, assignment_status char(1) NULL, created_date datetime NULL, ' +
                'CONSTRAINT id_unique UNIQUE(tenant_ticket_id, assignment_seq, engineer_username, assignment_from, assignment_response, assignment_status, created_date))',
              [],
              (txt, rest) => {
                command.yellow(
                  'table cm_assignment_pic_tmp created successfully',
                );
              },
              error => {
                command.red(
                  'error on create table cm_assignment_pic_tmp ' +
                    error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    command.red('table cm_assignment_pic_tmp error : ' + error.message);
  }
};
