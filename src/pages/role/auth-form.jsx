import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree} from 'antd'
import AddForm from "./add-form";
import menuList from "../../config/menuConfig";

const Item = Form.Item

class AuthForm extends Component {

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state

        //定义form栅格布局
        const formItemLayout = {
            labelCol: {
                span: 4, //指定左侧label宽度
            },
            wrapperCol: {
                span: 16, //指定右侧包裹宽度
            }
        };

        const onCheck = (checkedKeys) => {
            this.setState({checkedKeys});
        };

        return (
            <Form {...formItemLayout}
            >
                <Item label="角色名称">
                    <Input value={role.name} disabled/>
                </Item>
                <Item>
                    <Tree checkable autoExpandParent={true}
                          treeData={menuList}
                          checkedKeys={checkedKeys}
                          onCheck={onCheck}
                    />
                </Item>
            </Form>
        );
    }
}

AuthForm.propTypes = {

}

export default AuthForm;
