import { 
    selectSp, 
    executeSp, 
    getCode, 
    getMenu, 
    getCodeDynamic, 
    loadSingle 
} 
from '../service/SpCallService'

const DB_REQUEST = 'REQUEST';
const DB_SELECT_SUCCESS = 'SELECT_SUCCESS';
const DB_EXECUTE_SUCCESS = 'EXECUTE_SUCCESS';
const DB_DOUBLE_SELECT = 'DOUBLE_SELECT';
const DB_FAIL = 'FAIL';
const DB_INIT = 'INIT'

const initialState = {
    spCall : {
        status: 'INIT',
        data : [],
        header: [],
        message: ''
    }
};

export const actionCreators = {
    loadRequest: (spname, params) => async (dispatch, getState) => {  

        dispatch({type:DB_REQUEST});    
        return selectSp(spname, params)
                .then(
                    response => dispatch({type:DB_SELECT_SUCCESS, response})                    
                ).catch(
                    e => dispatch({type:DB_FAIL, e})
                )
        
    },
    loadSingleRequest: (spname, params) => async (dispatch, getState) => {   
        
        dispatch({type:DB_REQUEST});
        
        return await loadSingle(spname, params)
                .then(
                    response => dispatch({type:DB_DOUBLE_SELECT, response})
                ).catch(
                    e => dispatch(DB_FAIL)
                )
        
    },    
    executeRequest : (spname, params) => (dispatch, getState) => {   
      
        dispatch({type:DB_REQUEST});
        
        return executeSp(spname, params)
            .then(
                response => dispatch({type:DB_EXECUTE_SUCCESS, response})
            ).catch(
                e => {
                    dispatch({type:DB_FAIL, e})
                }
            )
    },
    
    codeRequest : (groupid, where) => async (dispatch, getState) => {
        
        dispatch({type:DB_REQUEST});
        return await getCode(groupid, where)
                .then(
                    response => dispatch({type:DB_DOUBLE_SELECT, response})
                ).catch(
                    e => dispatch(DB_FAIL)
                )
    },
    
    codeDynamicReq : (groupid, where) => async (dispatch, getState) => {
        if(groupid === getState.groupid || where === getState.where)
            return;
        
        dispatch({type:DB_REQUEST});

        return await getCodeDynamic(groupid, where)
                .then(response => dispatch({type:DB_DOUBLE_SELECT, response}))
                .catch(
                    e => dispatch(DB_FAIL)
                )
    },

    menuRequest : (user_id) => async (dispatch, getState) => {
        
        dispatch({type:DB_REQUEST});
        
        return await getMenu(user_id).then(
            response => dispatch({type:DB_SELECT_SUCCESS, response})
            ).catch(
                e => dispatch(DB_FAIL)
            )
        
    }
}

export const reducer = (state, action) => {
    state = state || initialState;
    action = action || {type:DB_INIT};

    if (action.type === DB_REQUEST)
        return {
            ...state,
            status: 'WAITING',
            data: [],
            message: '',
            header: []
        }
    if (action.type === DB_SELECT_SUCCESS)
        return {
            ...state,
            spCall : {
                status: action.response.err ? 'FAIL' : 'SUCCESS',
                data: action.response.data,
                message: action.response.err,
                header: action.response.header
            }
        }
    if (action.type === DB_EXECUTE_SUCCESS)
        return {
            ...state,
            spCall : {
                status: action.response !== "OK" ? 'FAIL' : 'SUCCESS',
                data: [],
                message: action.response,
                header: []
            }
        }
    if (action.type === DB_FAIL)
        return {
            ...state,
            spCall : {
                status: 'FAIL',
                data: [],
                message: action.e,
                header: []
            }            
        }
    if (action.type === DB_DOUBLE_SELECT)
        return {
            ...state,
            spCall : {
                status: action.response.err ? 'FAIL' : 'SUCCESS',
                data: action.response.data,
                message: action.response.err,
                header: action.response.header
            }
    }
    else 
        return state;
}