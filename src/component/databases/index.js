import {uploadTables, uploadPendingTables} from './combinations';
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

export {
  uploadTables,
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
};
