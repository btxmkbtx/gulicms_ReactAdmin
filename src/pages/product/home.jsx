import React, {Component} from 'react';
import {Card, Table, Button, Select, message, Form, Input} from 'antd';
import {SearchOutlined, PlusOutlined} from "@ant-design/icons";
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";
import {PAGE_SIZE_OF_PRODUCTS} from "../../utils/constants";

const Item = Form.Item
const Option = Select.Option

/*Product的默认子路由组件*/
class ProductHome extends Component {

    state ={
        loading:false, //页面加载等待效果
        total: 0, // 商品总数
        products: [], // 商品数组
        searchKeyWord: '', // 搜索关键字
        searchType: 'productName', // 根据哪个字段搜索
    }

    /*获取指定页码的列表数据显示*/
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //在全局中保存当前页数，让其他方法可以看到
        this.setState({loading: true})
        const {searchKeyWord, searchType} = this.state
        //如果搜索关键字有值，就进行搜索分页
        let result
        if(searchKeyWord) {
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE_OF_PRODUCTS, searchKeyWord, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE_OF_PRODUCTS)
        }

        this.setState({loading: false})
        if(result.status === 0) {
            //取出分页数据，更新状态，显示列表
            const {total, list} = result.data
            this.setState({
                total,
                products: list,
            })
        }
    }

    /*更新指定商品的状态*/
    updateProductStatus = async (productId, newStatus) => {
        const result = await reqUpdateStatus(productId, newStatus)
        if(result.status===0) {
            message.success('商品状態更新成功')
            this.getProducts(this.pageNum)
        }

    }

    /*初始化Table所有列的数组*/
    initColumns = () => {
        //把columns挂载到组件自身, 方便在其他钩子中使用
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品紹介',
                dataIndex: 'desc',
            },
            {
                title: '価額',
                dataIndex: 'price',
                //设置dataIndex，render拿到的实参就是dataIndex指向的对象属性值，反之为一个完整的行对象数据
                render: (price) => {//这里拿到的price其实就是product.price
                    return price + '円'
                },
            },
            {
                title: '状态',
                width: 100,
                //如果没有设置dataIndex，render拿到的实参就是一个完整的行对象数据，反之为dataIndex指向的对象属性值
                render: (product) => {
                    const {status, _id} = product
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateProductStatus(_id, newStatus)}
                            >
                                {status===1?'販売中止':'販売再開'}
                            </Button>
                            <span>{status===1?'販売中':'売り切れ'}</span>
                        </span>
                    )
                },
            },
            {
                title: '操作',
                width: 100,
                //如果没有设置dataIndex，render拿到的实参就是一个完整的行对象数据，反之为dataIndex指向的对象属性值
                render: (product) => {//这里拿到的就是product的当前行对象
                    return (
                        <span>
                            {/*下面第二行证明：编程式路由的传参写法可以有不加展开运算符的简略写法*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {...product})}>詳細</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>編集</LinkButton>
                        </span>
                    )
                },
            },
        ];
    }

    //第一次挂载页面时，在render之前执行，避免每次刷新页面都重新生成columns
    constructor(props) {
        super(props);
        this.initColumns()
    }

    //初期化数据时发送异步请求
    componentDidMount() {
        //获取一级分类列表
        this.getProducts(1)
    }

    render() {

        const {products, total, loading, searchType, searchKeyWord} = this.state

        // Card左侧标题
        const title = (
            <span>
                <Select value={searchType}
                        style={{width: 150}}
                        onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>商品名称検索</Option>
                    <Option value='productDesc'>商品紹介検索</Option>
                </Select>
                <Input placeholder='キーワード' style={{width: 300, margin: '0 15px'}}
                       value={searchKeyWord}
                       onChange={event => this.setState({searchKeyWord: event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>
                    <SearchOutlined />
                    検索
                </Button>
            </span>
        )

        // Card右侧区域
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined/>
                商品追加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table dataSource={products} columns={this.columns}
                       /*小贴士：按照React的规范，所有的数组组件必须绑定key，
                       实例可参考todoList练习题，antD提供了rowKey属性来解决这个问题*/
                       rowKey='_id'
                       bordered
                       loading = {loading}
                       pagination={{
                           defaultPageSize:PAGE_SIZE_OF_PRODUCTS,
                           showQuickJumper:true,
                           total,
                           onChange: this.getProducts //<=简写 (pageNum)={this.getProducts(pageNum)}
                       }}
                />
            </Card>
        )
    }
}

export default ProductHome;
