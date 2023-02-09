const initialStateTicket = {
    info: {
        ticket_no: '',
        ticket_form: '',
        ticket_type: '',
        ticket_category: '',
        ticket_location: '',
        ticket_description: '',
        ticket_status_name: '',
        ticket_status_color: ''
    },
    ticket_no : '',
    state : ''
}

const TicketReducer = (state = initialStateTicket, action) => {
    switch(action.type){
        case 'SET_TICKET_NO':
            return {
                ...state,
                ticket_no :  action.ticket_no
            }
            break;
        case 'SET_LIST_STATE':
            return {
                ...state,
                state :  action.status
            }
            break;
        case 'LOAD_TICKET_DETAIL':
            return {
                info: {
                    ...state.info,
                    ticket_no: action.info.ticket_no,
                    ticket_form: action.info.ticket_form,
                    ticket_type: action.info.ticket_type,
                    ticket_category: action.info.ticket_category,
                    ticket_location: action.info.ticket_location,
                    ticket_description: action.info.ticket_description,
                    ticket_status_name: action.info.ticket_status_name,
                    ticket_status_color: action.info.ticket_status_color
                }
            }
            break;
        case 'CLEAR_TICKET_DETAIL':
            return {
                info: {
                    ticket_no: '',
                    ticket_form: '',
                    ticket_type: '',
                    ticket_category: '',
                    ticket_location: '',
                    ticket_description: '',
                    ticket_status_name: '',
                    ticket_status_color: ''
                }, 
                ticket_no : '',
                state: ''
            }
            break;
    }

    return state;
}

export default TicketReducer;