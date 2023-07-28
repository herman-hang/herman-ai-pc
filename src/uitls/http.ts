import axios from "axios";

// 创建一个新的请求实例instance,instance.的用法和axios.的用法一致，可以使用instance({})、instance.get（）、instance.post()
const instace = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000, // 超时时间
    headers: {
        'Content-Type': 'application/json',
    }, // 设置请求头
    withCredentials: true, // 跨域请求时是否需要使用凭证
});

// 配置请求拦截器,在请求之前的数据处理,比如在请求头添加token,所有的请求都会经过拦截器
instace.interceptors.request.use((config) => {
    const token = localStorage.getItem('Authorization')
    if (token) {
        // 设置登录token到请求头
        config.headers.Authorization = token
    }

    return config;
}, (err) => {

    return Promise.reject(err); //将错误消息挂到promise的失败函数上
}
);

// 配置响应拦截器
// 响应拦截器:在请求响应之后对数据处理，比如:登录失败、请求数据失败的处理
// instance.interceptors.response.use(response=>{l}, err=>{});
// 响应成功:执行回调函数1;响应失败，执行回调函数2
instace.interceptors.response.use((response) => {
    // token续期
    if (response.headers["x-new-token"] !== undefined && response.headers["x-new-token"] !== null && response.headers["x-new-token"] !== '') {
        localStorage.setItem('Authorization', response.headers["x-new-token"])
    }

    return response;
}, (err) => {

    return Promise.reject(err); // 将错误消息挂到promise的失败函数上
}
);

// 封装请求的api
const callapi = (method = "GET", url: string, data = {}) => {
    return instace({
        method,
        url,
        params: method === "GET" ? data : {},
        data: method === "POST" || method === "PUT" || "DELETE" ? data : {},
    });
};

// 封装请求函数
export const get = (url: string, data = {}) => callapi("GET", url, data);
export const post = (url: string, data = {}) => callapi("POST", url, data);
export const put = (url: string, data = {}) => callapi("PUT", url, data);
export const deleted = (url: string, data = {}) => callapi("DELETE", url, data);