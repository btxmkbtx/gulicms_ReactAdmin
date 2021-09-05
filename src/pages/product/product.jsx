import React, {Component} from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less' //在父组件中引用的样式可以自动共享给子组件和子路由组件

/*
商品管理路由
*/
export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/*exact:开启路由完全匹配，避免路由进入product内部寻找addupdate和detail*/}
                <Route exact path='/product' component={ProductHome} />
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Route path='/product/detail' component={ProductDetail} />
                <Redirect to="/product"/>
            </Switch>
        );
    }
}
