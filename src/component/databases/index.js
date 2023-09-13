import {uploadTables, uploadPendingTables, uploadTablesMaster} from './combinations';
import {createTables} from './create';
import {
  deleteTables,
  deleteExpiredTables,
  deleteTablesDetailPreventif,
} from './delete';
import {dropTable} from './drop';
import {inputTables, inputTablesLog} from './insert';
import {selectTables} from './select';
import {backgroundProcess} from './background';
import {collection} from './collection';

export {
  uploadTables,
  uploadTablesMaster,
  uploadPendingTables,
  createTables,
  deleteTables,
  deleteExpiredTables,
  deleteTablesDetailPreventif,
  dropTable,
  inputTables,
  inputTablesLog,
  selectTables,
  backgroundProcess,
  collection,
};
