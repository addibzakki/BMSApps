import {command} from '../../chalk';

export const db_cm_action_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cm_action_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cm_action_tmp(' +
                'runID INTEGER PRIMARY KEY AUTOINCREMENT,' +
                'tenant_ticket_id varchar(50) NOT NULL,' +
                'engineering_username varchar(250) NOT NULL,' +
                'description text NULL,' +
                'attachment varchar(250) NULL,' +
                'attachment_after varchar(250) NULL,' +
                'status_id int NULL,' +
                'time_taken time(0) NULL,' +
                'request_item int NULL,' +
                'request_item_list text NULL,' +
                'request_item_description text NULL,' +
                'confirm_item int NULL DEFAULT 0,' +
                'confirm_date datetime NULL,' +
                'created_date datetime NULL DEFAULT CURRENT_TIMESTAMP,' +
                'updated_date datetime NULL,' +
                'status_job varchar(7) NULL,' +
                'CONSTRAINT id_unique UNIQUE(tenant_ticket_id,engineering_username,description,attachment,attachment_after,status_id,time_taken,request_item,request_item_list,request_item_description,confirm_item,confirm_date,created_date,updated_date,status_job))',
              // 'CREATE UNIQUE INDEX id_UNIQUE ON cm_action_tmp (tenant_ticket_id,engineering_username,description,attachment,attachment_after,status_id,time_taken,request_item,request_item_list,request_item_description,confirm_item,confirm_date,created_date,updated_date,status_job)',
              [],
              (txt, rest) => {
                command.yellow(
                  'create table cm_action_tmp created successfully',
                );
              },
              error => {
                command.red(
                  'error on create table cm_action_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    command.red('table cm_action_tmp error : ' + error.message);
  }
};
