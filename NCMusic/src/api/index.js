import axios from 'axios'

//配置后端地址
const BASE_URL = 'http://localhost:3000'
//创建实例对象
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true//跨域请求时是否需要使用凭证
})

//请求拦截器,可以在请求发送前做一些处理
instance.interceptors.request.use(
    config => {
        return config
        //添加token
        // const token = localStorage.getItem('token')
        // if(token){
        //     config.headers.Authorization = `Bearer ${token}`
        // }
    },
    error => {
        return Promise.reject(error)
    }
)

//响应拦截器,可以在响应返回前做一些处理
instance.interceptors.response.use(
    response => {
      const data = response.data
        return data
    },
    error => {
      //处理全局错误响应401,未登录
      // if(error.response.status === 401){
      //   //跳转到登录页
      //   router.push('/login')
      // }
        return Promise.reject(error)
    }
)

//简单GET请求
export function get(url, params={}, config={}) {
    return instance.get(url, {params, ...config})
}
//简单POST请求
export function post(url, data={}, config={}) {
    return instance.post(url, data, config)
}

const api= {
    get,
    post
}
export default api
