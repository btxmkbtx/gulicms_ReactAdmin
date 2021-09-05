import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import memoryUtils from '../../utils/memoryUtils';
import storeUtils from "../../utils/storeUtils";
import './index.less'
import { Modal } from 'antd';
import LinkButton from "../link-button"

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),//自定义格式日期字符串
        dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png',
        weather: '晴れ',
    }

    getTime = () => {
        // 启动定时器，每隔一秒获取当前时间，并更新currentTime
        // 不要忘了卸载组件时清除组件内的定时器
        this.intervalID = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getTitle = (menuItems) => {
        // 得到当前请求路径
        const currentPath = this.props.location.pathname

        let title
        menuItems.forEach(item => {
            // 如果已经找到就不继续后面的递归遍历了
            if (title) {
                return title
            }

            // 找到menuConfig中的和当前路由一致的key，取得相应的路由title
            if (item.key === currentPath) {
                title = item.title
            } else if(item.children){
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem => currentPath.indexOf(cItem.key)===0)
                //如果存在说明匹配成功
                if(cItem){
                    title = cItem.title
                } else {
                    title = this.getTitle(item.children)
                }
            }
        })

        return title;
    }

    /*退出登录*/
    logout = () => {
        Modal.confirm({
            title: 'ログアウトしますか?',
            onOk: () => { //这个地方改成箭头函数，让函数内部的this指向外部this(组件对象this)
                //console.log('はい');

                //删除缓存登录数据
                storeUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login
                this.props.history.replace('/login')
            },
            onCancel() {
                //来验证一下不使用看箭头函数this指向哪里，答案：undefined
                console.log('いいえ', this);
            },
        })
    }

    /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
     */
    componentDidMount() {
        this.getTime()
    }

    /*
    组件卸载之前调用
     */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalID)
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state
        const {username} = memoryUtils.user
        const title = this.getTitle(menuList) //得到当前路由的title

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>ようこそ，{username}</span>
                    <LinkButton onClick={this.logout}>ログアウト</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt='weather'/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header)
