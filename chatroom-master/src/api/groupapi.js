import request from '@/util/request'

//获取群列表
export function getGroup(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    return request({
        url: '/groupchat/getGroups',
        method: 'post',
        data: formData
    })
}
//获取群聊天记录
export function getGroupMsg(params) {
    const formData = new FormData();
    formData.append('group_Id', params.groupId);
    return request({
        url: '/groupchat/getGroupHistory',
        method: 'post',
        data: formData
    })
}
//获取群成员
export function getGroupMember(params) {
    const formData = new FormData();
    formData.append('group_Id', params.groupId);
    return request({
        url: '/groupchat/getGroupMembers',
        method: 'post',
        data: formData
    })
}
//添加群
export function addGroup(params) {
    const formData = new FormData();
    formData.append('user_id', params.userId);
    formData.append('group_id', params.groupId);
    formData.append('date', params.time);
    return request({
        url: '/groupchat/addGroupMember',
        method: 'post',
        data: formData
    })
}
//添加群成员
export function addGroupMember(params) {
    return request({
        url: '/groupchat/addGroupMember',
        method: 'post',
        data: params
    })
}
//删除群
export function deleteGroup(params) {
    return request({
        url: '/groupchat/deleteGroup',
        method: 'post',
        data: params
    })
}
//删除群成员
export function deleteGroupMember(params) {
    return request({
        url: '/groupchat/deleteGroupMember',
        method: 'post',
        data: params
    })
}
