/*
能发送异步ajax请求的函数模块，注意是函数模块！
封装axios库
函数返回值是promise对象
优化1:统一请求处理异常？
    在外层包一个直接创建的promise对象
    在请求出错时，不调用reject(reason)，而是现实错误信息弹出提示
优化2:控制异步的返回得到的不是response，而是response.data。
    解决方案极其简单：在请求成功resolve回调时，resolve(response.data)
axios的请求代码参照github上的代码: https://github.com/axios/axios
*/

import axios from "axios";
import { message } from 'antd';

export default function ajax(url, data={}, type='GET') {

    let promise
    //1.执行异步ajax请求
    return new Promise((resolve, reject) => {
        if (type==='GET') { //发送GET请求
            promise = axios.get(url, {// 配置对象
                params: data // 指定请求参数
            })
        } else { //发送POST请求
            promise = axios.post(url, data)
        }

        //2.如果成功了,then,调用resolve(value)
        promise.then(response => {
            resolve(response.data)
        //3.如果失败了,不去调用reject(reason),而是提示异常信息
        }).catch(error => {
            message.error('请求出错'+error.message)
        })
    })

}
