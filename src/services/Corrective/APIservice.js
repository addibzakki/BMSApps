import axios from 'axios';

// function api for modul corrective

const CorrectiveAPIService = {
  // GET
  getTotalCorrective: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_total_corrective_dev/' +
        params[0] +
        '/' +
        params[1],
    );
  },
  getOnhandQty: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/get_onhand_qty_dev/' +
        params[0] +
        '/' +
        params[1],
    );
  },
  fetchListTicketPIC: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/fetch_list_ticket_pic_dev',
      params,
    );
  },
  fetchListAssignmentPIC: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/fetch_list_assignment_pic_dev',
      params,
    );
  },
  fetchListItem: function(params) {
    return axios.get('https://mynet.mmproperty.com/api/fetch_list_po_item_dev');
  },
  fetchListOnHand: function(params) {
    return axios.get(
      'https://mynet.mmproperty.com/api/fetch_list_on_hand_dev',
      params,
    );
  },
  fetchListAction: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/fetch_list_action_dev',
      params,
    );
  },
};

export default CorrectiveAPIService;
