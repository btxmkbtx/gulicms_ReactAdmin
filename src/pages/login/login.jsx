import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import {Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin, reqAddUser} from '../../api'
import memoryUtils from '../../utils/memoryUtils';
import storeUtils from '../../utils/storeUtils';

/*
表单提交后，校验成功的回调
*/
/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
*/

const user = memoryUtils.user

/*表单提交后，校验失败的回调*/
/*
定义在class外部时，this会变为undefined
如果需要使用this，就定义到class内部，如onFinish
*/
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

/*对密码进行自定义验证*/
const validatePwd = (getFieldValue) => ({
    validator(_, value) {
        if (value) {
            return Promise.resolve();
        }
        console.log(getFieldValue('username'))//
        return Promise.reject(new Error('パスワードを入力してください!'));
    },
})

export default class Login extends Component {

    onFinish = async (values) => {
        //console.log('提交ajax请求: ', values);
        // 请求登录
        const {username, password} = values
        // 把try封装到ajax，js内部
        // try {
        //     const response = await reqLogin(username, password)
        //     console.log("请求成功", response)
        // }catch (error) {
        //     alert("请求出错"+error.message)
        // }
        const result = await reqLogin(username, password)// {status:0, data:user} {status:1, msg:'xxx'}

        if(result.status === 0) {//登录成功
            message.success('登录成功')

            // 保存user
            const user = result.data
            memoryUtils.user = user //保存登录user
            storeUtils.saveUser(user)//保存到localstorage中去

            // 通过编程式路由跳转到管理界面(因为不需要回退到登录界面，所以用replace)
            this.props.history.replace('/')
        } else {//登录失败
            message.error(result.msg)
        }

    };

    render() {
        if (user && user._id) {
            return <Redirect to='/'/>
        }

        return (
            <div className="login">
                <header className="login-header">
                    {/*react的jsx不支持右边这种写法：<img src='./images/logo.png' alt="logo"/>
                    一定要先把资源import进来，再通过{}引用资源*/}
                    <img src={logo} alt="logo"/>
                    <h1>React·汎用管理システム</h1>
                </header>
                <section className="login-content">
                    <h2>ログイン</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            // 声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'ユーザー名は必須項目です！',
                                },
                                {
                                    min: 4,
                                    message: '長さの下限は4桁文字！',
                                },
                                {
                                    max: 12,
                                    message: '長さの上限は12桁文字！',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_#%&]+$/,
                                    message: '英数字と「_#%&」しか入力できません！',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    // required: true,
                                    // message: 'Please input your Password!',
                                },
                                ({ getFieldValue }) => validatePwd(getFieldValue),
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}
