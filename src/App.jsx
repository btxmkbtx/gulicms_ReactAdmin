import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
import Test from './pages/test/test'
// import 'antd/dist/antd.css' //因为在config-overrides中设置了style: true，所以这行就不需要手动导入了，如果手动导入会覆盖设置

/*
根组件A
 */
class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/test' component={Test}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
