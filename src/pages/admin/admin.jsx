import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import {Layout} from 'antd';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const {Footer, Sider, Content} = Layout

/*
后台管理的路由组件
*/
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 如果内存没有存储user==>当前没有登录
        if(!user || !user._id) {
            // 自动跳转到登录
            return <Redirect to='/login'/>
        }

        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:'20px',backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{color: '#cccccc', textAlign: 'center'}}>Chromeをおすすめます。</Footer>
                </Layout>
            </Layout>
        );
    }
}
