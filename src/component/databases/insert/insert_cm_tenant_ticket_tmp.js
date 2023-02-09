import {command} from '../../chalk';

export const insert_cm_tenant_ticket_tmp = async (db, data) => {
  try {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT OR REPLACE INTO cm_tenant_ticket_tmp (tenant_ticket_id, entity_project, entity_cd, project_no, tenant_id, form_id, type_id, category_id, tenant_ticket_location, tenant_ticket_description, tenant_ticket_attachment, tenant_ticket_post, tenant_ticket_done, status_id, rating, rating_comment, rejected, rejected_as, rejected_by, rejected_date, priority, status_tenant, status_bak, status_bap, created_by, refs_ticket, chargeable, ifca_remarks, ifca_shift_cd, ifca_loc_cd, request_no, form_desc, type_desc, category_desc, status_color, status_name, status_job) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.tenant_ticket_id,
          data.entity_project,
          data.entity_cd,
          data.project_no,
          data.tenant_id,
          data.form_id,
          data.type_id,
          data.category_id,
          data.tenant_ticket_location,
          data.tenant_ticket_description,
          data.tenant_ticket_attachment,
          data.tenant_ticket_post,
          data.tenant_ticket_done,
          data.status_id,
          data.rating,
          data.rating_comment,
          data.rejected,
          data.rejected_as,
          data.rejected_by,
          data.rejected_date,
          data.priority,
          data.status_tenant,
          data.status_bak,
          data.status_bap,
          data.created_by,
          data.refs_ticket,
          data.chargeable,
          data.ifca_remarks,
          data.ifca_shift_cd,
          data.ifca_loc_cd,
          data.request_no,
          data.form_desc,
          data.type_desc,
          data.category_desc,
          data.status_color,
          data.status_name,
          'sending',
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            // command.green('insert table cm_tenant_ticket_tmp successfully');
          }
        },
        error => {
          command.red(
            'error on insert table cm_tenant_ticket_tmp ' + error.message,
          );
        },
      );
    });
  } catch (error) {
    command.red('error on insert table cm_tenant_ticket_tmp ' + error.message);
  }
};
