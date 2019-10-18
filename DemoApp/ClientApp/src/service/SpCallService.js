import axios from 'axios';
import Cookies from 'js-cookie';


function requestCall(url, param) {
    return axios.post(url, {
        headers: {
            'Content-type': 'x-www-form-urlencoded',
            'Accept': 'application/json',
            'data-Type': 'json'
        },
        body: JSON.stringify(param)
    })
    .then(response => response.data)
    .catch(e => console.log(e));
}


// Load sp
export function selectSp(spname, where) {
    const param = {
        sql: spname,
        args: where === undefined ? {} : where
    }
    
    return requestCall('api/Common/LoadSql', param)
}

export function loadSingle(spname, where) {
    const param = {
        sql: spname,
        args: where === undefined || where === null ? {} : where
    }
               
    return requestCall('api/Common/LoadSqlSingle', param)
}


// update or delete or create
export function executeSp(spname, where) {
    const param = {
        sql: spname,
        args: where === undefined || where === null ? {} : where,
        saveBy: Cookies.get('user_id') === undefined ? 'pda' : Cookies.get('user_id')
    }
    
    return requestCall('api/Common/ExecuteSql', param)
}

export function getCode(groupid, where) {    
    const param = {
        GroupId: groupid,
        Where: where === undefined || where === null ? '' : where
    }

    return requestCall('api/Common/Code', param)
}

// call code
export function getCodeDynamic(groupid, where) {
    const param = {
        args: {
            Group_Id: groupid,
            Where: where
        }
    }
    
    return requestCall('api/Common/CodeDynamic', param)
}


// call menu
export function getMenu(user_id) {    
    return axios.get('api/Common/Menu')
            .then(response => response.data);
}

// login
export function setLogin(username, pw) {    
    const userInfo = {
        user_id: username,
        password: pw
    }
    
    return requestCall('/User/Login', userInfo)
}

export function setTest(){
    return axios.post('User/SetTest')
    .then(response => response)
}

