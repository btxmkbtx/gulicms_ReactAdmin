import React, {Component} from 'react';
import {Card, Table, Button, Modal} from 'antd';
import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from "../../api"
import {
    PlusOutlined ,
    ArrowRightOutlined ,
} from '@ant-design/icons';
import { message } from 'antd';
import AddForm from "./add-form";
import UpdateForm from "./update-form";
import {PAGE_SIZE_OF_CATEGORY} from "../../utils/constants";

/*
商品种类路由
*/
export default class Category extends Component {

    state = {
        loading:false, //页面加载等待效果
        categories:[], //一级分类列表(数组)，初始值设计为空数组
        subCategories:[], //二级分类列表
        parentId:'0', //当前正在显示的分类列表的父分类Id
        parentName:'',
        showModelStatus: 0, //控制「添加/更新」确认对话框的显示模式; 0：都不显示 1：显示添加 2：显示更新
    }

    //点击链接显示对应的二级列表
    showSubCategories = (category) => {
        this.setState({
            parentId:category._id,
            parentName:category.name
        }, ()=>{//在setState批量推迟更新完成后执行该回调
            //在这里更新二级分类的原因是因为setState不会立即更新状态，有异步性，要保证父ID更新完成后再调用getCategories
            this.getCategories()
        })
    }

    //点击链接返回一级列表状态
    showCategories = () => {
        this.setState({
            parentId:'0',
            parentName:'',
            subCategories:[],
        })
    }

    /*初始化Table所有列的数组*/
    initColumns = () => {
        //把columns挂载到组件自身, 方便在其他钩子中使用
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                //如果没有设置dataIndex，render拿到的实参就是一个完整的行对象数据，反之为dataIndex指向的对象属性值
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => {this.showUpdate(category)}}>名称変更</LinkButton>
                        {/*如何向事件回调函数传递参数:先定义一个匿名函数，在匿名函数中调用目标函数并传入数据*/}
                        {this.state.parentId === '0' ?
                            <LinkButton onClick={() => {this.showSubCategories(category)}}>詳細一覧</LinkButton>
                            : null}
                    </span>
                ),
            },
        ];
    }

    /*
    异步获取分类列表显示
    parentId:如果没有传入实参就从state里面拿
    */
    getCategories = async (parentId) => {
        this.setState({loading:true})
        parentId = parentId || this.state.parentId //如果没有传入实参就从state里面拿
        const result = await reqCategorys(parentId)
        this.setState({loading:false})
        if(result.status === 0) {

            const categories = result.data
            if(parentId === '0') {
                //更新一级状态
                this.setState({
                    categories
                })
            } else {
                //更新二级状态
                this.setState({
                    subCategories:categories
                })
            }

        } else {
            message.error(result.msg)
        }
    }

    /*
    响应点击对话框的取消按钮:隐藏确认对话框
    */
    handleCancel = () => {
        this.setState({
            showModelStatus: 0
        })
    }

    /*
    显示添加操作确认框
    */
    showAdd = () => {
        this.setState({
            showModelStatus: 1
        })
    }

    /*
    显示更新操作确认框
    */
    showUpdate = (category) => {
        //保存分类对象到组件对象上，这里没有必要用状态管理它，因为就自己的其他方法用而已
        this.category = category

        //显示更新对话框
        this.setState({
            showModelStatus: 2
        })
    }

    /*添加分类*/
    addCategory = () => {

        //利用validateFields，触发表单验证
        this.form.validateFields().then(async values => {

            //隐藏更新对话框
            this.setState({
                showModelStatus: 0
            })

            //准备数据
            const categoryName = this.form.getFieldValue('categoryName')
            const parentId = this.form.getFieldValue('parentId')

            //发送分类添加请求
            const result = await reqAddCategory(parentId, categoryName)
            if(result.status===0) {
                //如果添加分类为当前显示类
                if (parentId===this.state.parentId) {
                    //刷新分类列表数据
                    this.getCategories()
                } else if(parentId==='0') {//如果在二级分类显示状态下添加一级分类，重新获取一级分类，但是不需要改变当前父级ID
                    this.getCategories('0')
                }

            }else {
                message.error(result.msg)
            }

        }).catch(errorInfo => {})

    }

    /*更新分类*/
    updateCategory = () => {

        //利用validateFields，触发表单验证
        this.form.validateFields().then(async values => {
            //隐藏更新对话框
            this.setState({
                showModelStatus: 0
            })

            //准备数据
            const categoryId = this.category._id
            //const categoryName = this.form.getFieldValue('categoryName') //既可以从form实例中得到表单项
            const {categoryName} = values                                  //也可以从values中得到表单项

            //发送分类更新请求
            const result = await reqUpdateCategory({categoryId, categoryName})
            if(result.status===0) {
                //刷新分类列表数据
                this.getCategories()
            }else {
                message.error(result.msg)
            }
        }).catch(errorInfo => {})

    }

    //第一次挂载页面时，在render之前执行，避免每次刷新页面都重新生成columns
    constructor(props) {
        super(props);
        this.initColumns()
    }

    //初期化数据时发送异步请求
    componentDidMount() {
        //获取一级分类列表
        this.getCategories()
    }

    render() {
        //读取状态数据中的一级分类列表，塞给dataSource
        const {categories, subCategories, parentId, parentName, loading, showModelStatus} = this.state

        //读取点击修改分类时保存的分类项
        const category = this.category || {name:''}

        // Card左侧标题
        const title = parentId === '0' ? "ルート品目一覧" : (
            <span>
                <LinkButton onClick={this.showCategories}>ルート品目一覧</LinkButton>
                <ArrowRightOutlined style={{marginRight:10}}/>
                <span>
                    {parentName}
                </span>
            </span>
        )

        // Card右侧区域
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined/>
                追加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table dataSource={parentId==='0' ? categories : subCategories}
                       columns={this.columns}
                       /*小贴士：当属性值被省略时，就带属性为布尔类型，默认值为true；bordered={true}*/
                       bordered
                       showQuickJumper
                       /*小贴士：按照React的规范，所有的数组组件必须绑定key，
                       实例可参考todoList练习题，antD提供了rowKey属性来解决这个问题*/
                       rowKey='_id'
                       loading={loading}
                       pagination={{defaultPageSize:PAGE_SIZE_OF_CATEGORY}}
                />;

                <Modal title="添加分类" visible={showModelStatus===1}
                       onOk={this.addCategory}
                       onCancel={this.handleCancel}>
                    <AddForm categories={categories} parentId={parentId}
                             setForm={(form) => {this.form = form}}/>
                </Modal>

                <Modal title="修改分类" visible={showModelStatus===2}
                       onOk={this.updateCategory}
                       onCancel={this.handleCancel}>
                    <UpdateForm categoryName={category.name}
                                setForm={(form) => {this.form = form}}/>
                </Modal>
            </Card>
        );
    }
}
