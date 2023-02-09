import {combineReducers} from 'redux';
import NewsReducer from './NewsReducer';
import LoginReducer from './LoginReducer';
import LogoutReducer from './LogoutReducer';
import FormReducer from './FormReducer';
import ProjectReducer from './ProjectReducer';
import MeterReducer from './MeterReducer';
import TicketReducer from './TicketReducer';
import AreaReducer from './AreaReducer';
import ProfileIdReducer from './ProfileIdReducer';
import GlobalReducer from './GlobalReducer';
import CorrectiveReducer from './CorrectiveReducer';
import PreventifReducer from './PreventifReducer';

const reducer = combineReducers({
  LoginReducer,
  LogoutReducer,
  FormReducer,
  NewsReducer,
  ProjectReducer,
  MeterReducer,
  TicketReducer,
  AreaReducer,
  ProfileIdReducer,
  GlobalReducer,
  CorrectiveReducer,
  PreventifReducer,
});

export default reducer;
