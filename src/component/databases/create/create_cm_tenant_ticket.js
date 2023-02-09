export const db_cm_tenant_ticket_tmp = async db => {
  try {
    await db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cm_tenant_ticket_tmp'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cm_tenant_ticket_tmp(tenant_ticket_id varchar(50) PRIMARY KEY, entity_project int NULL, entity_cd int NULL, project_no varchar(10) NULL, tenant_id int, form_id int NULL, type_id int NULL, category_id int NULL, tenant_ticket_location varchar(255) NULL, tenant_ticket_description text NULL, tenant_ticket_attachment varchar(255) NULL, tenant_ticket_post datetime NULL, tenant_ticket_done datetime NULL, status_id int NULL, rating int NULL, rating_comment text NULL, rejected int NULL, rejected_as varchar(50) NULL, rejected_by varchar(250) NULL, rejected_date datetime NULL, priority int NULL, status_tenant int NULL, status_bak int NULL, status_bap int NULL, created_by varchar(100) NULL, refs_ticket varchar(50) NULL, chargeable char(1) NULL, ifca_remarks text NULL, ifca_shift_cd varchar(5) NULL, ifca_loc_cd varchar(5) NULL, request_no varchar(10) NULL, form_desc varchar(150) NULL, type_desc varchar(150) NULL, category_desc varchar(150) NULL, status_color varchar(50) NULL, status_name varchar(50) NULL, status_job varchar(7) NULL, CONSTRAINT id_unique UNIQUE(entity_project, entity_cd, project_no, tenant_id, form_id, type_id, category_id, tenant_ticket_location, tenant_ticket_description, tenant_ticket_attachment, tenant_ticket_post, tenant_ticket_done, status_id, rating, rating_comment, rejected, rejected_as, rejected_by, rejected_date, priority, status_tenant, status_bak, status_bap, created_by, refs_ticket, chargeable, ifca_remarks, ifca_shift_cd, ifca_loc_cd, request_no, form_desc, type_desc, category_desc, status_color, status_name, status_job))',
              [],
              (txt, rest) => {
                console.log(
                  'create table cm_tenant_ticket_tmp created successfully',
                );
              },
              error => {
                console.log(
                  'error on create table cm_tenant_ticket_tmp ' + error.message,
                );
              },
            );
          }
        },
      );
    });
  } catch (error) {
    console.log('error on create table cm_tenant_ticket_tmp ' + error.message);
  }
};
