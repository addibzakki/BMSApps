import {command} from '../../chalk';

export const insert_cm_assignment_pic_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO cm_assignment_pic_tmp (tenant_ticket_id, assignment_seq, engineer_username, assignment_from, assignment_response, assignment_status, created_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          data.tenant_ticket_id,
          data.assignment_seq,
          data.engineer_username,
          data.assignment_from,
          data.assignment_response,
          data.assignment_status,
          data.created_date,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.cyan('insert table cm_assignment_pic_tmp successfully');
          }
        },
        error => {
          command.red(
            'error on insert table cm_assignment_pic_tmp ' + error.message,
          );
        },
      );
    });
  } catch (error) {
    command.red('error on insert table cm_assignment_pic_tmp ' + error.message);
  }
};
