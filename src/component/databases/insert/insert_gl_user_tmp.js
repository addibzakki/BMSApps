import {command} from '../../chalk';

export const insert_gl_user_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO gl_user_tmp (username, emp_division_id, emp_name, emp_job_position, emp_photo) VALUES (?, ?, ?, ?, ?)',
        [
          data.username,
          data.emp_division_id,
          data.emp_name,
          data.emp_job_position,
          data.emp_photo,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.green('insert table gl_user_tmp successfully');
          }
        },
        error => {
          command.red('error on insert table gl_user_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on insert table gl_user_tmp ' + error.message);
  }
};
