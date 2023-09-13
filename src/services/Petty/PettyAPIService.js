import axios from '../axiosDev';
// function api for modul corrective

const PettyLAPIService = {
    // POST
    submitSettle: function (params) {
        return axios.post('/submit_settle', params);
    },

    createTransaction: function (params) {
        return axios.post('/fn_petty/create_transaction_detail', params);
    },
    
    submitSettlement: function (params) {
        return axios.post('/fn_petty/push_to_settlement', params);
    },

    // GET
    getBalance: function (params) {
        return axios.get('/fn_petty/balance?receive_by=' + params);
    },
    getListTopup: function (params) {
        return axios.get('/fn_petty/list_transactions?receive_by=' + params);
    },
    getDetail: function (params) {
        return axios.get('/fn_petty/transaction_detail?entity_project=' + params.entity_project +'&project_no=' + params.project_no +'&bank_cd=' + params.bank_cd +'&doc_no=' + params.doc_no);
    },
    getDetailByID: function (params) {
        return axios.get('/fn_petty/transaction_detail_id?id=' + params);
    },
};

export default PettyLAPIService;
