import React, {Component} from 'react';
import './index.less'

/*这个组件因为不需要状态，我们这里可以练习一下函数式组件
函数式组件也称为stateless component无状态组件
现在这种定义的组件可以写state了，如state hook*/

/*外形像连接的按钮*/
export default function LinkButton(props) {
    return <button {...props} className="link-button"></button>
};
