import Vue from "vue"

import axios from 'axios'

import { MessageBox } from 'element-ui'
const server = axios.create({
    baseURL: '/api'
})

export default ({ store, redirect }) => {
    //请求拦截
    server.interceptors.request.use(
        async config => {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.common['Authorzation'] = 'Bearer ' + token
            }
            return config
        }
    )

    //响应拦截
    server.interceptors.response.use(
        async response => {
            let { data } = response
            // console.log("$message", data);
            if (data.code === -666) {
                MessageBox.confirm(data.message, {
                    confirmButtonText: '去登陆',
                    showCancelButton: false
                }).then(() => {
                    localStorage.removeItem('token')
                    // 路由跳转到登录页，使用redirect函数。
                    // 不能直接使用redirect，需要用 export default ({store, redirect})=>{}这个函数把两个拦截器包裹起来，
                    // 就可以用redirect这个方法实现路由跳转了
                    redirect({ path: '/login' })
                })
            }
            return data
        }
    )
}





Vue.prototype.$http = server

export const http = server