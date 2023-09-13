import {fetch_cm_assignment_pic} from '../combinations/combination_cm_assignment_pic';
import {fetch_cm_item} from '../combinations/combination_cm_item';
import {fetch_cm_onhand} from '../combinations/combination_cm_onhand';
import {fetch_cm_tenant_ticket} from '../combinations/combination_cm_tenant_ticket';
import {fetch_gl_area} from '../combinations/combination_gl_area';
import {fetch_gl_user} from '../combinations/combination_gl_user';
import {createTables} from '../create';
import {db_cm_action_tmp} from '../create/create_cm_action';
import {db_cm_assignment_pic_tmp} from '../create/create_cm_assignment_pic';
import {db_cm_item_tmp} from '../create/create_cm_item';
import {db_cm_onhand_tmp} from '../create/create_cm_onhand';
import {db_cm_tenant_ticket_tmp} from '../create/create_cm_tenant_ticket';
import {db_gl_area_tmp} from '../create/create_gl_area';
import {db_gl_user_tmp} from '../create/create_gl_user';
import {db_pv_checklist_tmp} from '../create/create_pv_checklist_tmp';
import {db_pv_checkstandart_tmp} from '../create/create_pv_checkstandart_tmp';
import {deleteExpiredTables} from '../delete';

export const collection = reducer => {
  createTables(db, 'bms_meter');
  createTables(db, 'list_meter');
  createTables(db, 'bms_meter_temp');
  createTables(db, 'bms_volume_trx_temp');
  createTables(db, 'bms_meter_log');

  db_pv_checklist_tmp(db);
  db_pv_checkstandart_tmp(db);

  db_cm_tenant_ticket_tmp(db);
  db_cm_assignment_pic_tmp(db);
  db_cm_item_tmp(db);
  db_cm_action_tmp(db);
  db_cm_onhand_tmp(db);
  db_gl_user_tmp(db);
  db_gl_area_tmp(db);
  deleteExpiredTables(db);

  fetch_cm_tenant_ticket(db, reducer);
  fetch_cm_assignment_pic(db);
  fetch_cm_onhand(db);
  fetch_gl_user(db);
  fetch_gl_area(db);
  fetch_cm_item(db);
};
