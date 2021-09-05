import React, {Component} from 'react';
import {Card, Button, Table, message, Modal} from "antd";
import {PAGE_SIZE_OF_ROLES} from "../../utils/constants";
import {reqRoles, reqAddRole} from "../../api";
import AddForm from "./add-form";
import AuthForm from "./auth-form";

/*
角色路由
*/
export default class Role extends Component {

    state = {
        roles: [], //所有角色的列表
        selectedRole: {}, //选中的role行
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false, //是否显示设置权限界面
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {// 点击行
                console.log("onClick")
                this.setState({
                    selectedRole: role
                })
            },
        }
    }

    /*
    添加角色
     */
    addRole = () => {
        //表单验证通过后进入then回调
        this.form.validateFields().then(async values => {
            //收集输入数据
            const {roleName} = values
            this.form.resetFields()

            //请添加
            const result = await reqAddRole(roleName)
            if(result.status===0){
                message.success("添加角色成功!")
                const role = result.data
                /*
                //react非常不建议这种写法来直接更新状态,会引发Pure组件的浅比较问题
                const roles = this.state.roles
                roles.push(role)
                this.setState({
                    roles
                })*/
                //推荐状态改写写法↓
                this.setState(state => ({
                    roles: [...state.roles, role]
                }))
            } else {
                message.success("添加角色失败o(╥﹏╥)o")
            }

            //隐藏确认框
            this.setState({isShowAdd: false})
        })

    }

    updateRoleAuth = () => {

    }

    constructor(props){
        super(props)
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const {roles, selectedRole, isShowAdd, isShowAuth} = this.state

        const title = (
            <span>
                <Button type="primary" onClick={() => {this.setState({isShowAdd: true})}}>创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={() => {this.setState({isShowAuth: true})}} disabled={!selectedRole._id}>设置角色权限 </Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table dataSource={roles}
                       columns={this.columns}
                       bordered
                       showQuickJumper
                       rowKey='_id'
                       pagination={{defaultPageSize:PAGE_SIZE_OF_ROLES}}
                       rowSelection={{
                           type: 'radio',
                           selectedRowKeys: [selectedRole._id]
                       }}
                       onRow={this.onRow}
                />
                <Modal title="添加分类" visible={isShowAdd}
                       onOk={this.addRole}
                       onCancel={() => {
                           this.setState({
                               isShowAdd: false
                           })
                           this.form.resetFields()
                       }}>
                    <AddForm setForm={form => this.form = form}/>
                </Modal>
                <Modal title="设置角色权限" visible={isShowAuth}
                       onOk={this.updateRoleAuth}
                       onCancel={() => {
                           this.setState({
                               isShowAuth: false
                           })
                       }}>
                    <AuthForm role={selectedRole}/>
                </Modal>
            </Card>
        )
    }
}
