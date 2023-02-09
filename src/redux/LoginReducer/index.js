const initialStateLogin = {
    form: {
        token: '',
        profile: []
    },
    info: '',
    isLogin: 'false',
    isIntro: 'false'
}

const LoginReducer = (state = initialStateLogin, action) => {
    switch(action.type){
        case 'SET_INFO':
            return {
                ...state,
                info: action.info,
            }
        case 'CLEAR_TOKEN':
            return {
                ...state,
                info: '',
                form: {
                    ...state.form,
                    token: '',
                }
            }
        case 'SET_TOKEN':
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.inputType]: action.inputValue,
                }
            }
        case 'SET_FORM':
            return {
                ...state,
                isLogin: 'true',
                form: {
                    ...state.form,
                    profile: action.profile
                }
            }
        case 'SET_INTRO':
            return {
                ...state,
                isIntro: 'true'
            }
        case 'SET_BACK_INTRO':
            return {
                ...state,
                isIntro: 'false'
            }
        case 'AUTH_LOGOUT':
            return {
                ...state,
                isLogin: 'false',
                form: {
                    token: '',
                    profile: []
                }
            }
    }

    return state;
}

export default LoginReducer;