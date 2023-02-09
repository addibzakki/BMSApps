const initialStateForm = {
    form: {
        location: '',
        description: '',
        fileList: [],
        picture: []
    },
    form_ticket_info: '',
    form_ticket_list: [],
    form_ticket_choose: -1,
    type_ticket_info: '',
    type_ticket_list: [],
    type_ticket_choose: -1,
    category_ticket_info: '',
    category_ticket_list: [],
    category_ticket_choose: -1,
    isRequireAttachment: false,
    isNext: false,
    isLoading: false
}

const FormReducer = (state = initialStateForm, action) => {
    switch(action.type){
        case 'CLEAR_FORM':
            return {
                ...state,
                form: {
                    ...state.form,
                    location: '',
                    description: '',
                    fileList: [],
                    picture: []
                },
                form_ticket_info: '',
                form_ticket_list: [],
                form_ticket_choose: -1,
                type_ticket_info: '',
                type_ticket_list: [],
                type_ticket_choose: -1,
                category_ticket_info: '',
                category_ticket_list: [],
                category_ticket_choose: -1,
                isRequireAttachment: false,
                isNext: false,
                isLoading: false
            }
        case 'LOAD_LIST_FORM':
            return {
                ...state,
                form_ticket_info: 'Choose one form according to your needs ?',
                form_ticket_list: action.list,
                type_ticket_info: '',
                type_ticket_list: [],
                type_ticket_choose: -1,
                category_ticket_info: '',
                category_ticket_list: [],
                category_ticket_choose: -1,
                isNext: false
            }
        case 'SET_FORM_CHOOSEN':
            return {
                ...state,
                form_ticket_choose: action.choosen
            }
        case 'CLEAR_TYPE':
            return {
                ...state,
                type_ticket_info: '',
                type_ticket_list: [],
                type_ticket_choose: -1,
                isNext: false
                }
        case 'LOAD_LIST_TYPE':
            return {
                ...state,
                type_ticket_info: 'Choose one type according to your needs ?',
                type_ticket_list: action.list,
                isNext: false
            }
        case 'SET_TYPE_CHOOSEN':
            return {
                ...state,
                type_ticket_choose: action.choosen,
                category_ticket_choose: false
            }
        case 'CLEAR_CATEGORY':
            return {
                ...state,
                category_ticket_info: '',
                category_ticket_list: [],
                category_ticket_choose: -1,
                isNext: false
                }
        case 'LOAD_LIST_CATEGORY':
            return {
                ...state,
                category_ticket_info: 'Choose one category according to your needs ?',
                category_ticket_list: action.list,
                isNext: false
            }
        case 'SET_CATEGORY_CHOOSEN':
            return {
                ...state,
                category_ticket_choose: action.choosen,
                isNext: true
            }
        case 'SET_DETAIL_TICKET':
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.inputType]: action.inputValue,
                }
            }
        case 'SET_ATTACHMENT':
            return {
                ...state,
                form: {
                    ...state.form,
                    fileList: action.filelist,
                    picture: action.picture
                }
            }
        case 'SET_ATTACHMENT_REQUIRED':
            return {
                ...state,
                isRequireAttachment: action.required
            }
    }

    return state;
}

export default FormReducer;