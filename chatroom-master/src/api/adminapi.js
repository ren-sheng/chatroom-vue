import request from '@/util/request'

//管理员登录
export function adminLogin(params) {
    console.log(params)
    const formData = new FormData();
    formData.append('username', params.userID);
    formData.append('password', params.password);
    return request({
        url: '/admin/login',
        method: 'post',
        data: formData
    })
}

//中断用户连接
export function interruptUser(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    return request({
        url: '/admin/disconnect',
        method: 'post',
        data: formData
    })
}

//广播消息
export function broadcast(params) {
    const formData = new FormData();
    formData.append('message', params.meg);
    return request({
        url: '/admin/broadcast',
        method: 'post',
        data: formData
    })
}