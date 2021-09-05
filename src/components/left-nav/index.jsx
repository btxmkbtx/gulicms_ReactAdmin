import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import './index.less'
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig.jsx";

const { SubMenu } = Menu;

/*
左侧导航的组件
*/
class LeftNav extends Component {

    /*根据menu数组动态生成menu标签*/
    /*map()+递归算法*/
    getMenuNodes_map = (menuList) => {
        /*
            title: 'XX',
            key: '/products',
            icon: 'appstore',
            children: [...]
        */
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /*reduce()+递归算法*/
    getMenuNodes = (menuList) => {
        /*得到当前路由路径*/
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            // 判断当前节点是否有子路由
            if (!item.children) {
                pre.push(
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                // 查找是否存在与当前请求路径匹配的子item
                // path.indexOf(childItem.key)的写法是为了应对product这种多个路由共享一个菜单标签的情况
                const cItem = item.children.find(childItem=>path.indexOf(childItem.key)===0)
                // 如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }

                pre.push(
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {/*有子节点的对象要递归*/}
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

            return pre

        }, [])
    }

    //①第一次挂载页面时，在render之前执行，避免每次刷新页面都重新生成menu
    //②在render渲染之前先执行getMenuNodes，来确定当前选中菜单项和需要展开的二级菜单项
    constructor(props) {
        super(props);
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        //得到当前路由路径
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0) {
            path = '/product'
        }

        //获取当前需要展开的二级菜单请求路径(路由)
        const openKey = this.openKey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>管理システム</h1>
                </Link>

                {/*实际开发中不会写这种硬代码，会根据自定义config动态生成菜单*/}
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>

            </div>
        );
    }
}

/*
withRouter高阶组件:他可以把非路由组件变成路由组价
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)
