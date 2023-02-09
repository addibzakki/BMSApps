import {command} from '../../chalk';

export const insert_cm_action_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO cm_action_tmp (runID,tenant_ticket_id,engineering_username,description,attachment,attachment_after,status_id,time_taken,request_item,request_item_description,confirm_item,confirm_date,created_date,updated_date, status_job) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)',
        [
          data.runID,
          data.tenant_ticket_id,
          data.engineering_username,
          data.description,
          data.attachment,
          data.attachment_after,
          data.status_id,
          data.time_taken,
          data.request_item,
          data.request_item_description,
          data.confirm_item,
          data.confirm_date,
          data.created_date,
          data.updated_date,
          'sending',
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.cyan('insert table cm_action_tmp successfully');
          }
        },
        error => {
          command.red('error on insert table cm_action_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on insert table cm_action_tmp ' + error.message);
  }
};
