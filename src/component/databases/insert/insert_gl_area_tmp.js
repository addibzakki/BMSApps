import {command} from '../../chalk';

export const insert_gl_area_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO gl_area_tmp(workArea, project_no, username, scanDate, checkOutDate, longitude, latitude, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.workArea,
          data.project_no,
          data.username,
          data.scanDate,
          data.checkOutDate,
          data.longitude,
          data.latitude,
          data.photo,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.cyan('insert table gl_area_tmp successfully');
          }
        },
        error => {
          command.red('error on insert table gl_area_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    command.red('error on insert table gl_area_tmp ' + error.message);
  }
};
