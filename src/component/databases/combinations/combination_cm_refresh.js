import {CorrectiveAPIService} from '../../../services';
import GlobalAPIService from '../../../services/Global/APIservice';
import {insert_cm_assignment_pic_tmp} from '../insert/insert_cm_assignment_pic';
import {insert_cm_item_tmp} from '../insert/insert_cm_item';
import {insert_cm_onhand_tmp} from '../insert/insert_cm_onhand';
import {insert_cm_tenant_ticket_tmp} from '../insert/insert_cm_tenant_ticket_tmp';
import {insert_gl_area_tmp} from '../insert/insert_gl_area_tmp';
import {insert_gl_user_tmp} from '../insert/insert_gl_user_tmp';

export const refresh_cm = (db, params) => {
  db.transaction(txn => {
    // cm_tenant_ticket_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS cm_tenant_ticket_tmp',
      [],
      (txn, res) => {
        console.log('table cm_tenant_ticket_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS cm_tenant_ticket_tmp(tenant_ticket_id varchar(50) PRIMARY KEY, entity_project int NULL, entity_cd int NULL, project_no varchar(10) NULL, tenant_id int, form_id int NULL, type_id int NULL, category_id int NULL, tenant_ticket_location varchar(255) NULL, tenant_ticket_description text NULL, tenant_ticket_attachment varchar(255) NULL, tenant_ticket_post datetime NULL, tenant_ticket_done datetime NULL, status_id int NULL, rating int NULL, rating_comment text NULL, rejected int NULL, rejected_as varchar(50) NULL, rejected_by varchar(250) NULL, rejected_date datetime NULL, priority int NULL, status_tenant int NULL, status_bak int NULL, status_bap int NULL, created_by varchar(100) NULL, refs_ticket varchar(50) NULL, chargeable char(1) NULL, ifca_remarks text NULL, ifca_shift_cd varchar(5) NULL, ifca_loc_cd varchar(5) NULL, request_no varchar(10) NULL, form_desc varchar(150) NULL, type_desc varchar(150) NULL, category_desc varchar(150) NULL, status_color varchar(50) NULL, status_name varchar(50) NULL, status_job varchar(7) NULL, CONSTRAINT id_unique UNIQUE(entity_project, entity_cd, project_no, tenant_id, form_id, type_id, category_id, tenant_ticket_location, tenant_ticket_description, tenant_ticket_attachment, tenant_ticket_post, tenant_ticket_done, status_id, rating, rating_comment, rejected, rejected_as, rejected_by, rejected_date, priority, status_tenant, status_bak, status_bap, created_by, refs_ticket, chargeable, ifca_remarks, ifca_shift_cd, ifca_loc_cd, request_no, form_desc, type_desc, category_desc, status_color, status_name, status_job))',
          [],
          async (txt, rest) => {
            console.log(
              'create table cm_tenant_ticket_tmp created successfully',
            );
            try {
              const data = {
                usernm: params.form.profile.username,
                level: params.form.profile.level,
              };
              const resp = await CorrectiveAPIService.fetchListTicketPIC(data);
              console.log(
                'total cm_tenant_ticket_tmp ' + resp.data.list.length,
              );
              resp.data.list.map(data => {
                insert_cm_tenant_ticket_tmp(db, data);
              });
            } catch (error) {
              console.log(
                'error on table cm_tenant_ticket_tmp ' + error.message,
              );
            }
          },
          error => {
            console.log(
              'error on create table cm_tenant_ticket_tmp ' + error.message,
            );
          },
        );
      },
      error => {
        console.log(
          'error on drop table cm_tenant_ticket_tmp : ' + error.message,
        );
      },
    );
    // cm_assignment_pic_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS cm_assignment_pic_tmp',
      [],
      (txn, res) => {
        console.log('table cm_assignment_pic_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS cm_assignment_pic_tmp(tenant_ticket_id varchar(50) PRIMARY KEY, assignment_seq varchar(5), engineer_username varchar(250), assignment_from varchar(50) NULL, assignment_response datetime NULL, assignment_status char(1) NULL, created_date datetime NULL, ' +
            'CONSTRAINT id_unique UNIQUE(tenant_ticket_id, assignment_seq, engineer_username, assignment_from, assignment_response, assignment_status, created_date))',
          [],
          async (txt, rest) => {
            console.log(
              'create table cm_assignment_pic_tmp created successfully',
            );
            try {
              const resp = await CorrectiveAPIService.fetchListAssignmentPIC();
              console.log(
                'total cm_assignment_pic_tmp ' + resp.data.list.length,
              );
              resp.data.list.map(data => {
                insert_cm_assignment_pic_tmp(db, data);
              });
            } catch (error) {
              console.log(
                'error on table cm_assignment_pic_tmp ' + error.message,
              );
            }
          },
          error => {
            console.log(
              'error on create table cm_assignment_pic_tmp ' + error.message,
            );
          },
        );
      },
      error => {
        console.log(
          'error on drop table cm_assignment_pic_tmp : ' + error.message,
        );
      },
    );
    // cm_onhand_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS cm_onhand_tmp',
      [],
      (txn, res) => {
        console.log('table cm_onhand_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS cm_onhand_tmp(entity_project INTEGER PRIMARY KEY, entity_cd varchar(4) NULL, item_cd varchar(20) NULL, onhand_qty decimal(12,4),' +
            'CONSTRAINT id_unique UNIQUE(onhand_qty))',
          [],
          async (txt, rest) => {
            console.log('create table cm_onhand_tmp created successfully');
            try {
              const resp = await CorrectiveAPIService.fetchListOnHand();
              console.log('total cm_onhand_tmp ' + resp.data.list.length);
              resp.data.list.map(data => {
                insert_cm_onhand_tmp(db, data);
              });
            } catch (error) {
              console.log('error on table cm_onhand_tmp ' + error.message);
            }
          },
          error => {
            console.log('error on create table cm_onhand_tmp ' + error.message);
          },
        );
      },
      error => {
        console.log('error on drop table cm_onhand_tmp : ' + error.message);
      },
    );
    // gl_user_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS gl_user_tmp',
      [],
      (txn, res) => {
        console.log('table gl_user_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS gl_user_tmp(username varchar(150) PRIMARY KEY, emp_division_id int, emp_name varchar(100) NULL, emp_job_position varchar(100) NULL, emp_photo varchar(255) NULL, CONSTRAINT id_unique UNIQUE(emp_division_id, emp_name, emp_job_position, emp_photo))',
          [],
          async (txt, rest) => {
            console.log('create table gl_user_tmp created successfully');
            try {
              const resp = await GlobalAPIService.fetchListUser();
              console.log('total gl_user_tmp ' + resp.data.list.length);
              resp.data.list.map(data => {
                insert_gl_user_tmp(db, data);
              });
            } catch (error) {
              console.log('error on table gl_user_tmp ' + error.message);
            }
          },
          error => {
            console.log('error on create table gl_user_tmp ' + error.message);
          },
        );
      },
      error => {
        console.log('error on drop table gl_user_tmp : ' + error.message);
      },
    );
    // gl_area_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS gl_area_tmp',
      [],
      (txn, res) => {
        console.log('table gl_area_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS gl_area_tmp(workArea int NULL, project_no varchar(10) NULL, username varchar(50) NULL, scanDate datetime NULL, checkOutDate datetime NULL, longitude varchar(50) NULL, latitude varchar(50) NULL, photo varchar(255) NULL);' +
            'CREATE UNIQUE INDEX id_UNIQUE ON gl_area_tmp (workArea, project_no, username, scanDate, checkOutDate, longitude, latitude, photo)',
          [],
          async (txt, rest) => {
            console.log('create table gl_area_tmp created successfully');
            try {
              const resp = await GlobalAPIService.fetchListWorkArea();
              console.log('total gl_area_tmp ' + resp.data.list.length);
              resp.data.list.map(data => {
                insert_gl_area_tmp(db, data);
              });
            } catch (error) {
              console.log('error on table gl_area_tmp ' + error.message);
            }
          },
          error => {
            console.log('error on create table gl_area_tmp ' + error.message);
          },
        );
      },
      error => {
        console.log('error on drop table gl_area_tmp : ' + error.message);
      },
    );
    // cm_item_tmp
    txn.executeSql(
      'DROP TABLE IF EXISTS cm_item_tmp',
      [],
      (txn, res) => {
        console.log('table cm_item_tmp drop successfully');
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS cm_item_tmp(item_cd varchar(20) PRIMARY KEY, descs_mobile varchar(255), uom varchar(4) NULL, UNIQUE (descs_mobile, uom) ON CONFLICT IGNORE)',
          [],
          async (txt, rest) => {
            console.log('create table cm_item_tmp created successfully');
            try {
              const resp = await CorrectiveAPIService.fetchListItem();
              var count = 0;
              resp.data.list.map(data => {
                insert_cm_item_tmp(db, data);
                count = count + 1;
              });
              console.log('total data in cm_item_tmp : ' + count);
            } catch (error) {
              console.log('error on table cm_item_tmp ' + error.message);
            }
          },
          error => {
            console.log('error on create table cm_item_tmp ' + error.message);
          },
        );
      },
      error => {
        console.log('error on drop table cm_item_tmp : ' + error.message);
      },
    );
  });
};
