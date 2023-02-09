import {CorrectiveAPIService} from '../../../services';
import {insert_cm_tenant_ticket_tmp} from '../insert/insert_cm_tenant_ticket_tmp';

export const fetch_cm_tenant_ticket = async (db, params) => {
  try {
    const data = {
      usernm: params.form.profile.username,
      level: params.form.profile.level,
    };
    const res = await CorrectiveAPIService.fetchListTicketPIC(data);
    res.data.list.map(data => {
      insert_cm_tenant_ticket_tmp(db, data);
    });

    var temp = [];
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM cm_tenant_ticket_tmp',
        [],
        (txn, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          console.log(
            'total data in cm_tenant_ticket_tmp : ' + res.rows.length,
          );
          // command.green(temp);
        },
        error => {
          console.log('error on table cm_tenant_ticket_tmp ' + error.message);
        },
      );
    });
  } catch (error) {
    console.log('error on table cm_tenant_ticket_tmp ' + error.message);
  }
};
