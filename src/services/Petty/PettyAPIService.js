import axios from '../axiosPreventive';
// function api for modul petty cash

const PettyLAPIService = {
    // POST
    submitSettle: function (params) {
        return axios.post('/submit_settle', params);
    },
    createTransaction: function (params) {
        return axios.post('/fn_petty/create_transaction_detail', params);
    },
    modifyTransaction: function (params) {
        return axios.post('/fn_petty/update_transaction_detail', params);
    },
    createRequest: function (params) {
        return axios.post('/fn_petty/create_request', params);
    },
    modifyRequest: function (params) {
        return axios.post('/fn_petty/modify_request', params);
    },
    submitSettlement: function (params) {
        return axios.post('/fn_petty/push_to_settlement', params);
    },
    updateSettlement: function (params) {
        return axios.post('/fn_petty/update_settlement', params);
    },
    receiveTopUp: function (params) {
        return axios.post('/fn_petty/receive_top_up', params);
    },
    getLocation: function (params) {
        return axios.post('/fn_petty/get_list_location', params);
    },

    getLimit: function (params) {
        return axios.post('/fn_petty/get_limit', params);
    },

    // GET
    getNotif: function (params) {
        return axios.get('/fn_petty/get_notif?user=' + params);
    },
    getBalance: function (params) {
        return axios.get('/fn_petty/balance?receive_by=' + params);
    },
    getListTopup: function (params) {
        return axios.get('/fn_petty/list_transactions?receive_by=' + params);
    },
    getListTopupPending: function (params) {
        return axios.get('/fn_petty/list_transactions_pending?receive_by=' + params);
    },
    getDetail: function (params) {
        return axios.get('/fn_petty/transaction_detail?entity_project=' + params.entity_project +'&project_no=' + params.project_no +'&doc_no=' + params.doc_no);
    },
    getDetailByID: function (params) {
        return axios.get('/fn_petty/transaction_detail_id?id=' + params);
    },
    getDetailRequest: function (params) {
        return axios.get('/fn_petty/get_detail_request?id=' + params);
    },
    getListHistoryRequest: function (params) {
        return axios.get('/fn_petty/list_history_request?receive_by=' + params);
    },
};

export default PettyLAPIService;
