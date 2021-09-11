//引入react核心库
import React from 'react'
//引入页面渲染库ReactDOM
import ReactDOM from 'react-dom'
//引入App
import App from './App'

import memoryUtils from "./utils/memoryUtils";
import storeUtils from "./utils/storeUtils";

//读取local中的user，保存到内存中,方便以后的动作都从内存中取登录用户
memoryUtils.user = storeUtils.getUser()

ReactDOM.render(<App/>,document.getElementById('root'))
