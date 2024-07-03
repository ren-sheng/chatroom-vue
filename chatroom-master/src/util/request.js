import axios from 'axios'
const baseURL = 'http://100.67.32.81:8080';
const instance = axios.create({ baseURL });

//定义拦截响应器
instance.interceptors.response.use(
    result => {
        if (result.code = true) {
            return result.data;
        }
        else {
            ElementUI.Message.error(result.msg);
            return Promise.reject(result.msg);
        }
    },
    err => {
        alert("服务异常")
        return Promise.reject(err);
    }
)//异步

export default instance;