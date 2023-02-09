import Splash from './Splash';
import Login from './Login';
import Register from './Register';
import WelcomeAuth from './WelcomeAuth';
import Introduce from './Introduce';
import Profile from './Profile';
import Comming from './Comming';
import AdminAssignment from './Admin/Assignment/index';
import AdminDashboard from './Admin';
import AdminMeter from './Admin/Meter/index';
import AdminMeterReadingDashboard from './Admin/Meter/dashboardReading';
import AdminMeterReading from './Admin/Meter/reading';
import AdminMeterListHistory from './Admin/Meter/list';
import AdminMeterDetail from './Admin/Meter/detail';
import AdminMeterUpload from './Admin/Meter/upload';
import AdminMeterFilter from './Admin/Meter/filter';
import AdminMeterBarcode from './Admin/Meter/barcode';
import AdminMeterWriting from './Admin/Meter/writing';
import AdminMeterHistory from './Admin/Meter/history';
import AdminMeterRead from './Admin/Meter/read';
import AdminMeterUnread from './Admin/Meter/unread';
import AdminHelpdesk from './Admin/Assignment/Corrective/index';
import AdminHelpdeskForm from './Admin/Assignment/Corrective/form';
import AdminHelpdeskList from './Admin/Assignment/Corrective/list';
import AdminHelpdeskShow from './Admin/Assignment/Corrective/show';
import AdminHelpdeskEngineer from './Admin/Assignment/Corrective/engineer';
import AdminHelpdeskType from './Admin/Assignment/Corrective/type';
import AdminHelpdeskPriority from './Admin/Assignment/Corrective/priority';
import AdminHelpdeskCategory from './Admin/Assignment/Corrective/category';
import AdminHelpdeskActivity from './Admin/Assignment/Corrective/activity';
import AdminHelpdeskHistory from './Admin/Assignment/Corrective/history';
import WorkArea from './WorkArea';
import FormArea from './WorkArea/form';
/* DASHBOARD PREVENTIF */
import AdminPreventif from './Admin/Assignment/Preventif';
import AdminPreventifPhotoBefore from './Admin/Assignment/Preventif/form_photo_before';
import AdminPreventifListChecklist from './Admin/Assignment/Preventif/list_checklist';
import AdminPreventifListCheckStandart from './Admin/Assignment/Preventif/list_check_standart';
import AdminPreventifListHistory from './Admin/Assignment/Preventif/list_history';
import AdminPreventifListHistoryCheckStandart from './Admin/Assignment/Preventif/list_history_check_standart';
import AdminPreventifToCorrective from './Admin/Assignment/Preventif/list_confirmation_to_corrective';
import AdminPreventifShow from './Admin/Assignment/Preventif/show';
import AdminPreventiveDashboard from './Admin/Assignment/Preventif/dashboard';
import AdminPreventifConfirmSubmit from './Admin/Assignment/Preventif/list_confirmation_submit';
import AdminPreventifListShowChecklist from './Admin/Assignment/Preventif/list_show_checklist';
import AdminPreventifListShowCheckStandart from './Admin/Assignment/Preventif/list_show_check_standart';
import AdminPreventifListShowHistoryChecklist from './Admin/Assignment/Preventif/list_show_history_checklist';

/* DASHBOARD SPL */
import AdminSPL from './Admin/SPL/index';
import RequestSPL from './Admin/SPL/request';
import ListSPL from './Admin/SPL/list';
import ListApprovalSPL from './Admin/SPL/list_approval';
import ShowSPL from './Admin/SPL/show';
import HistorySPL from './Admin/SPL/history';
import FormApprovalSPL from './Admin/SPL/form_approval';

export {
  Splash,
  Introduce,
  Login,
  Register,
  WelcomeAuth,
  Profile,
  Comming,
  AdminAssignment,
  AdminDashboard,
  AdminMeter,
  AdminMeterReadingDashboard,
  AdminMeterReading,
  AdminMeterListHistory,
  AdminMeterDetail,
  AdminMeterUpload,
  AdminMeterFilter,
  AdminMeterBarcode,
  AdminMeterWriting,
  AdminMeterHistory,
  AdminMeterRead,
  AdminMeterUnread,
  AdminHelpdesk,
  AdminHelpdeskForm,
  AdminHelpdeskList,
  AdminHelpdeskShow,
  AdminHelpdeskEngineer,
  AdminHelpdeskPriority,
  AdminHelpdeskCategory,
  AdminHelpdeskType,
  AdminHelpdeskActivity,
  AdminHelpdeskHistory,
  WorkArea,
  FormArea,
  AdminSPL,
  RequestSPL,
  ListSPL,
  ListApprovalSPL,
  ShowSPL,
  HistorySPL,
  FormApprovalSPL,
  AdminPreventif,
  AdminPreventifPhotoBefore,
  AdminPreventifListChecklist,
  AdminPreventifListCheckStandart,
  AdminPreventifToCorrective,
  AdminPreventifConfirmSubmit,
  AdminPreventifListHistory,
  AdminPreventifListHistoryCheckStandart,
  AdminPreventifShow,
  AdminPreventiveDashboard,
  AdminPreventifListShowChecklist,
  AdminPreventifListShowCheckStandart,
  AdminPreventifListShowHistoryChecklist,
};
