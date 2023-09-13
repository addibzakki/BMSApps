import {command} from '../../chalk';
export const createTables = (db, table) => {
  db.transaction(txn => {
    if (table == 'bms_meter') {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS bms_meter(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd varchar(5) NULL, project_no varchar(20) NULL, meter_id varchar(50) NULL, curr_read_date date NULL, read_by varchar(150) NULL, UNIQUE (entity_cd, meter_id, curr_read_date, read_by) ON CONFLICT IGNORE)',
        [],
        (txn, res) => {
          command.green('table bms_meter created successfully');
        },
        error => {
          command.red('error on creating table bms_meter ' + error.message);
        },
      );
    } else if (table == 'bms_meter_temp') {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS bms_meter_temp(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd varchar(5) NULL, project_no varchar(20) NULL, debtor_acct varchar(150) NULL, lot_no varchar(10) NULL, debtor_name varchar(250) NULL, meter_id varchar(50) NULL, meter_cd varchar(150) NULL, last_read_date DATE NULL, last_read float NULL, last_read_high float NULL, curr_read_date date NULL, curr_read float NULL, curr_read_high float NULL, flag char(1) NULL, attachment text NULL, tenant_name varchar(250) NULL, signature text NULL, status char(1) NULL, read_by varchar(150) NULL, available BOOLEAN NOT NULL CHECK (available IN (0, 1)), longitude varchar(50) NULL, latitude varchar(50) NULL)',
        [],
        (txn, res) => {
          command.green('table bms_meter_temp created successfully');
        },
        error => {
          command.red(
            'error on creating table bms_meter_temp ' + error.message,
          );
        },
      );
    } else if (table == 'bms_volume_trx_temp') {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS bms_volume_trx_temp(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd varchar(5) NULL, db_identity varchar(2) NULL, project_no varchar(20) NULL, meter_cd varchar(150) NULL, month varchar(2) NULL, year varchar(4) NULL, status varchar(1) NULL, shape varchar(10) NULL, length float NULL, diameter float NULL, width float NULL, height float NULL, volume float NULL, clean_water_rate float NULL, dirty_water_rate float NULL, dirty_water_usage float NULL, read_by varchar(150) NULL, read_date date NULL)',
        [],
        (txn, res) => {
          command.green('table bms_volume_trx_temp created successfully');
        },
        error => {
          command.red(
            'error on creating table bms_volume_trx_temp ' + error.message,
          );
        },
      );
    } else if (table == 'bms_meter_log') {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS bms_meter_log(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd varchar(5) NULL, project_no varchar(20) NULL, debtor_acct varchar(150) NULL, lot_no varchar(10) NULL, debtor_name varchar(250) NULL, meter_id varchar(50) NULL, meter_cd varchar(150) NULL, last_read_date DATE NULL, last_read float NULL, last_read_high float NULL, curr_read_date date NULL, curr_read float NULL, curr_read_high float NULL, flag char(1) NULL, attachment text NULL, tenant_name varchar(250) NULL, signature text NULL, status char(1) NULL, read_by varchar(150) NULL, available BOOLEAN NOT NULL CHECK (available IN (0, 1)), longitude varchar(50) NULL, latitude varchar(50) NULL, status_trx varchar(50) NULL)',
        [],
        (txn, res) => {
          command.green('table bms_meter_log created successfully');
        },
        error => {
          command.red('error on creating table bms_meter_log ' + error.message);
        },
      );
    } else {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS list_meter(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd VARCHAR(50) NULL, lot_no varchar(50) NULL, project_no VARCHAR(50) NULL, debtor_acct varchar(50) NULL, debtor_name varchar(250) NULL, meter_id varchar(50) NULL, read_date datetime NULL, last_read float NULL, last_read_high float NULL, business_id varchar(50) NULL, ref_no varchar(50) NULL, UNIQUE (entity_cd, lot_no, project_no, debtor_acct, debtor_name, meter_id, read_date, last_read, last_read_high, business_id) ON CONFLICT IGNORE)',
        [],
        (txn, res) => {
          command.green('table list_meter created successfully');
        },
        error => {
          command.red('error on creating table list_meter ' + error.message);
        },
      );
      // txn.executeSql(
      //   'CREATE TABLE IF NOT EXISTS list_meter(rowID INTEGER PRIMARY KEY AUTOINCREMENT, entity_cd VARCHAR(50) NULL, lot_no varchar(50) NULL, project_no VARCHAR(50) NULL, debtor_acct varchar(50) NULL, debtor_name varchar(250) NULL, meter_id varchar(50) NULL, read_date datetime NULL, last_read float NULL, last_read_high float NULL, business_id varchar(50) NULL, ref_no varchar(50) NULL, category_cd VARCHAR(50) NULL)',
      //   [],
      //   (txn, res) => {
      //     command.red('table list_meter created successfully');
      //   },
      //   error => {
      //     command.red('error on creating table list_meter ' + error.message);
      //   },
      // );
    }
  });
};
