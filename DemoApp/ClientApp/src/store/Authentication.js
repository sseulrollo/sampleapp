import {
    setLogin
} 
from '../service/SpCallService'
import Cookies from 'js-cookie';

const LOGIN_REQUEST = 'REQUEST';
const LOGIN_FAIL = 'FAIL';

const LOGIN_INITAIL = 'INIT';

const initialState = {
    login: {
        status: 'INIT',
        message: ''
    }
};

export const actionCreators = {
    loginRequest: (user_id, password) => async (dispatch, getState) => {
        // log in api 시작
        dispatch({type:LOGIN_REQUEST});

        return await setLogin(user_id, password)
                .then(
                    response => {
                        if(response.status === 'SUCCESS') {
                            let loginData = {
                                isLoggedIn: true,
                                key: response.msg
                            };
                        
                        document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                        document.cookie = 'user_id=' + user_id;

                        window.location.reload()

                    }else {
                        dispatch({type: LOGIN_FAIL, response})
                    }}
                )
                .catch(e => dispatch({type:LOGIN_FAIL, e}));
    
    },
    logout: () => async(dispatch, getState) => {
        localStorage.clear();
        Cookies.remove('key');
        window.location.href = '/';
    }
}

export const reducer = (state, action) => {
    
    state = state || initialState;
    action = action || {type:LOGIN_INITAIL};

    
    if (action.type=== LOGIN_REQUEST)
        return {
            ...state,
            login : {
                status: 'WAITING',
                message: ''
            }
        }
    else if (action.type=== LOGIN_FAIL){
        return {
            ...state,
            login : {
                status: 'FAIL',
                message: action.response.msg
            }
        }}
    else 
        return state;
}