const initialStateLogout = {
    logout_info: '',
}

const LogoutReducer = (state = initialStateLogout, action) => {
    switch(action.type){
        case 'AUTH_LOGOUT':
            return {
                ...state,
                logout_info: 'tes logout',
            }
    }

    return state;
}

export default LogoutReducer;