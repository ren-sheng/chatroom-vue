import request from '@/util/request.js'

//查询用户
export function queryUsername(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    return request.post('/user/queryUsername', formData)
}

//登录
export function login(params) {
    const formData = new FormData();
    formData.append('userID', params.userID);
    formData.append('password', params.password);
    console.log(formData)
    return request.post('/user/login', formData)
}
//注册
export function register(params) {
    const formData = new FormData();
    formData.append('username', params.username);
    formData.append('password', params.password);
    formData.append('headimg', params.headImg);
    return request.post('/user/register', formData)
}
//查询当前在线用户
export function queryOnlineUser() {
    return request.get('/session/getOnlineUsers')
}