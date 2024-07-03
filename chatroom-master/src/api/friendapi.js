import request from '@/util/request'

//获取随机头像
export function getAvatar() {
    return request({
        url: 'https://api.uomg.com/api/rand.avatar?sort=动漫女&format=json',
        method: 'get'
    })
}
//获取好友列表
export function getFriend(params) {
    const formData = new FormData();
    formData.append('userId', params.userID);
    return request({
        url: '/friendchat/getFriends',
        method: 'post',
        data: formData
    })
}
//获取聊天记录
export function getChatMsg(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    formData.append('friendId', params.friendId);
    return request({
        url: '/friendchat/getFriendHistory',
        method: 'post',
        data: formData
    })
}
//添加好友
export function addFriend(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    formData.append('friendId', params.friendId);
    formData.append('date', params.time);
    return request({
        url: '/friendchat/addFriend',
        method: 'post',
        data: formData
    })
}
//删除好友
export function deleteFriend(params) {
    const formData = new FormData();
    formData.append('userId', params.userId);
    formData.append('friendId', params.friendId);
    return request({
        url: '/friendchat/deleteFriend',
        method: 'post',
        data: formData
    })
}