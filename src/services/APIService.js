import axios from 'axios';
import {axios as axiosDev} from './axiosDev';
const APIService = {
  // POST
  getDashboard: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_data_dashboard_dev',
      params,
    );
  },
  getSubMenuTicket: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_list_status_dev',
      params,
    );
  },
  getListTicket: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_list_assignment_dev',
      params,
    );
  },
  getSupervisor: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_list_engineer_dev',
      params,
    );
  },
  checkoutArea: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/checkout_work_area_dev',
      params,
    );
  },
  checkDataArea: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/check_work_area_dev',
      params,
    );
  },
  submitWorkArea: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/store_work_area_dev',
      params,
    );
  },
  getWorkArea: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_work_area_dev',
      params,
    );
  },
  submitPhotoBeforePreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/upload-before',
      params[1],
    );
  },
  updateStatusDetailPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/details/' + params[0],
      params[1],
    );
  },
  getListEngineerCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_list_engineer_dev',
      params,
    );
  },
  submitAssignmentCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/submit_assignment_dev',
      params,
    );
  },
  submitActionAssignmentCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/action_assignment_dev',
      params,
    );
  },
  submitRequestTransferCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/request_transfer_dev',
      params,
    );
  },
  getListItemCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/get_list_item_dev',
      params,
    );
  },
  submitActivityTakenCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/create_activity_taken_dev',
      params,
    );
  },
  updateActivityTakenCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/update_activity_taken_dev',
      params,
    );
  },
  submitConfirmItemCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/update_confirm_item_dev',
      params,
    );
  },
  submitHoldTicketCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/hold_ticket_dev',
      params,
    );
  },
  submitSearchItemCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/search_item_dev',
      params,
    );
  },
  submitUpdateStatusCorrective: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/update_status_ticket_dev',
      params,
    );
  },

  submitHeaderPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/submit',
      params[1],
    );
  },
  approveSubmitPreventive: function(params) {
    return axios.post('http://api.mmproperty.com/preventives/approve', params);
  },
  rejectSubmitPreventive: function(params) {
    return axios.post('http://api.mmproperty.com/preventives/rejected', params);
  },
  submitToCorrectiveFromPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/corrective',
      params[1],
    );
  },

  // PATCH
  submitApprovePreventifToCorrective: function(params) {
    return axios.patch(
      'http://api.mmproperty.com/wait-corrective/' + params + '/submit',
    );
  },
  submitRejectPreventifToCorrective: function(params) {
    return axios.patch(
      'http://api.mmproperty.com/wait-corrective/' +
        params +
        '/reject-corrective',
    );
  },

  // GET
  getEngineer: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_ticket_engineer_dev/' + params,
    );
  },
  getListPriority: function(params) {
    return axios.get('https://mynet.mmproperty.com/api/get_list_priority_dev');
  },
  getListType: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_list_type_dev/' + params,
    );
  },
  getListCategory: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_list_category_dev/' + params,
    );
  },
  getListPreventif: function(params) {
    return axiosDev.get('/preventive-maintenances?' + params);
  },
  getListHistoryPreventif: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/histories?' + params,
    );
  },
  getItemPreventif: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/' + params,
    );
  },
  getListActivityCorrective: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_list_activity_dev/' + params,
    );
  },
  getListPreventifToCorrective: function(params) {
    return axios.get(
      'http://api.mmproperty.com/wait-corrective?is_corrective=0',
    );
  },
  getListPreventifSubmitList: function(params) {
    return axios.get('http://api.mmproperty.com/preventives/approve');
  },
  getImageFromPreventive: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/image-befores/' +
        params,
    );
  },
};

export default APIService;
