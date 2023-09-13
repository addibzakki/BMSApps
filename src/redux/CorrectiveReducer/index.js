const initialState = {
  checklist: false,
  ticket_no: null,
  ticket_status_id: null,
  ticket_status_tenant: null,
  pic_status: null,
  type: null,
  ticket_type: null,
  ticket_category: null,
  ticket_purpose: null,
  ticket_priority: null,
  list_engineer: [],
  list_menu: [],
  pic_selected: null,
  pic_assigned: null,
  stateData: [],
  runID: null,
  is_ticket_pd: null,
};

const CorrectiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHECKLIST_CORRECTIVE':
      return {
        ...state,
        checklist: action.checklist,
      };
    case 'SET_PARAMS_ROUTE_CORRECTIVE':
      return {
        ...state,
        ticket_no: action.data.tenant_ticket_id,
        ticket_status_id: action.data.status_id,
        ticket_status_tenant: action.data.status_tenant,
        is_ticket_pd: action.data.is_ticket_pd,
      };
    case 'SET_TICKET_NO_CORRECTIVE':
      return {
        ...state,
        ticket_no: action.ticket_no,
      };
    case 'SET_TICKET_STATUS_ID_CORRECTIVE':
      return {
        ...state,
        ticket_status_id: action.ticket_status_id,
      };
    case 'SET_TICKET_STATUS_TENANT_CORRECTIVE':
      return {
        ...state,
        ticket_status_tenant: action.ticket_status_tenant,
      };
    case 'SET_PIC_STATUS_CORRECTIVE':
      return {
        ...state,
        pic_status: action.pic_status,
      };
    case 'SET_TYPE_CORRECTIVE':
      return {
        ...state,
        type: action.route_type,
      };
    case 'SET_TICKET_TYPE_CORRECTIVE':
      return {
        ...state,
        ticket_type: action.ticket_type,
      };
    case 'SET_TICKET_CATEGORY_CORRECTIVE':
      return {
        ...state,
        ticket_category: action.ticket_category,
      };
    case 'SET_TICKET_PURPOSE_CORRECTIVE':
      return {
        ...state,
        ticket_purpose: action.ticket_purpose,
      };
    case 'SET_TICKET_PRIORITY_CORRECTIVE':
      return {
        ...state,
        ticket_priority: action.ticket_priority,
      };
    case 'SET_LIST_ENGINEER_CORRECTIVE':
      return {
        ...state,
        list_engineer: action.list_engineer,
      };
    case 'SET_LIST_MENU_CORRECTIVE':
      return {
        ...state,
        list_menu: action.list,
      };
    case 'SET_PIC_CORRECTIVE':
      return {
        ...state,
        pic_selected: action.pic,
      };
    case 'SET_PIC_ASSIGNED_CORRECTIVE':
      return {
        ...state,
        pic_assigned: action.pic_assigned,
      };
    case 'SET_STATEDATA_CORRECTIVE':
      return {
        ...state,
        stateData: action.stateData,
      };
    case 'SET_RUNID_CORRECTIVE':
      return {
        ...state,
        runID: action.runID,
      };
  }

  return state;
};

export default CorrectiveReducer;
