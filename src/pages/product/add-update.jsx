import React, {PureComponent} from 'react';
import {Card, Form, Input, Cascader, Button, message} from "antd";
import LinkButton from "../../components/link-button";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategorys, reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";

const {Item} = Form
const { TextArea } = Input
const CategoryOptionsContext = React.createContext( {productCategoryIds:[]})

/**
 * hooks组件写法了解一下，静态模板拷贝antD=>级联选择=>动态加载选项
 * 参考antD＝＞cascader＝＞custom-render
 *
 * 自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：
 * 1.提供受控属性 value 或其它与 valuePropName 的值同名的属性。
 * 2.提供 onChange 事件或 trigger 的值同名的事件。
 */
const CategoryOptions = ({ value = {}, onChange }) => {
    const [options, setOptions] = React.useState([]);

    const categoryOptionsContext = React.useContext(CategoryOptionsContext)//从上下文中取出詳細リンク传过来的商品分類

    React.useEffect(() => {
        getCategories(0)
        onChange?.({
            ...value,
            ...categoryOptionsContext.productCategoryIds,
        });
    }, [])// 如果指定[stateValue]为[], 回调函数只会在第一次render()后执行,相当于componentDidMount()

    const initOptions = async (categories) => {
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,//不是叶子节点
        })) //回调函数返回一个对象结构应该用({key:value})

        //如果是一个二级分类商品的更新
        const {isUpdate, product} = categoryOptionsContext
        const {pCategoryId, categoryId} = product
        if(isUpdate && pCategoryId!=='0') {
            //获取对应的二级分类列表
            const subCategories = await getCategories(pCategoryId)
            //生成二级下拉列表options
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            })) //回调函数返回一个对象结构应该用({key:value})

            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联到对应的一级option上
            targetOption.children = childOptions
        }

        setOptions(options)
    }

    const onOptionsChange = (changedValue, selectedOptions) => {
        console.log(changedValue, selectedOptions);
        onChange?.({
            ...value,
            ...changedValue,
        });
    };

    /**
     * 获取一级或二级分类列表，并渲染到options中
     * async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
     */
    const getCategories = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.status===0) {
            const categories = result.data
            if(parentId === 0) {
                //初始化一级列表
                initOptions(categories)
            } else {
                //返回二级列表
                return categories //当前async函数返回的promise就会成功且value为categories
            }
        }
    }

    const loadData = async selectedOptions => {//antD把这个联机下拉框设计为可选择复数的式样，所以传进来的被选择对象是一个数组
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示加载动画
        targetOption.loading = true
        //根据选择的一级列表，请求获取二级列表
        const subCategories = await getCategories(targetOption.value)
        //隐藏加载动画
        targetOption.loading = false
        //如果二级列表数组有数据
        if(subCategories && subCategories.length>0) {
            //生成一个二级列表options
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            })) //回调函数返回一个对象结构应该用({key:value})
            targetOption.children = childOptions //关联到当前一级option上
        } else {//当前选项分类中没有二级列表
            targetOption.isLeaf = true
        }

        // 更新options状态
        setOptions([...options])
    }

    return <Cascader defaultValue={categoryOptionsContext.productCategoryIds}
                     options={options} loadData={loadData} onChange={onOptionsChange} changeOnSelect />

}

/*对商品分類进行自定义验证*/
const validateCategoryIds = (_, value) => {
    console.log(value)
    if (value) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('商品分類を選択してください!'));
}

/*Product添加和更新的子路由组件*/
class ProductAddUpdate extends PureComponent {

    constructor(props) {
        super(props)
        //通过有无参数来判断是商品追加リンク还是編集リンク迁移过来的
        const product = props.location.state　//如果是商品追加就没有product参数传过来
        this.isUpdate = !!product //!!表示强制把「!product」的结果转化为bool
        this.product = product || {} // || {}的使用技巧很有用，可以防止商品追加时的undefined空指针异常
        this.formRef = React.createRef()
        this.picWlRef = React.createRef()
        this.editorRef = React.createRef()
    }

    onFinish = async (values) => {
        //1.收集提交数据，并封装为API需要的product对象
        const {productName, productDesc, productPrice, categoryIds} = values

        let pCategoryId, categoryId
        if(categoryIds.length===1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.picWlRef.current.getImgs()
        const detail = this.editorRef.current.getDetailToHtml()

        const product = {
            categoryId,
            pCategoryId,
            name: productName,
            desc: productDesc,
            price: productPrice,
            imgs,
            detail,
        }
        //如果是更新，就添加_id
        if(this.isUpdate) {
            product._id = this.product._id
        }

        //2.调用添加/更新API
        const result = await reqAddOrUpdateProduct(product)
        if(result.status===0) {
            message.success(`${this.isUpdate? '更新':'添加'}商品成功！`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate? '更新':'添加'}商品失败！`)
        }

    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        //商品編集时，用来接收商品分類的级联目录数组
        const productCategoryIds = []
        if(isUpdate) {
            if(pCategoryId==='0') {
                productCategoryIds.push(categoryId)
            } else {
                productCategoryIds.push(pCategoryId)
                productCategoryIds.push(categoryId)
            }
        }

        //定义form栅格布局
        const formItemLayout = {
            labelCol: {
                span: 2, //指定左侧label宽度
            },
            wrapperCol: {
                span: 8, //指定右侧包裹宽度
            }
        };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}}/>
                </LinkButton>

                <span>{isUpdate ? '商品編集' : '商品追加'}</span>
            </span>
        )

        return (
            <CategoryOptionsContext.Provider value={{productCategoryIds,isUpdate,product}}>
                <Card title={title}>
                    <Form {...formItemLayout}
                          ref={this.formRef}
                          initialValues={{//如果initialValues的动态刷新,要使用setFieldsValue来完成
                              productName:product.name,
                              productDesc:product.desc,
                              productPrice:product.price,
                          }}
                          onFinish={this.onFinish}
                    >
                        <Item label="商品名称"
                              name="productName"
                              rules={[
                                  {
                                      required: true,
                                      message: '商品名称は必須項目です',
                                  },
                              ]}
                        >
                            <Input placrholder='商品名称を入力してください'/>
                        </Item>
                        <Item label="商品紹介"
                              name="productDesc"
                              rules={[
                                  {
                                      required: true,
                                      message: '商品紹介は必須項目です',
                                  },
                              ]}
                        >
                            <TextArea
                                placeholder="商品紹介を入力してください"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Item>
                        <Item label="商品価額"
                              name="productPrice"
                              rules={[
                                  {
                                      required: true,
                                      message: '商品価額は必須項目です',
                                  },
                                  //antD提供的校验规则无法满足价格大于0的校验，所以要靠正则校验pattern，或者下面的自定义校验
                                  {//通过typeof可以看到value是字符型，所以这里要转换数值来使用
                                      validator: (_, value) => {
                                          return value*1 > 0 ?
                                              Promise.resolve() :
                                              Promise.reject(new Error('商品価額は０円以上に入力してください'))
                                      },
                                  },
                              ]}
                        >
                            <Input type='number' placrholder='商品価額を入力してください' addonAfter="円"/>
                        </Item>
                        <Item label="商品分類"
                              name="categoryIds"
                              rules={[
                                  {
                                      required: true,
                                      type: 'object',
                                      message: '商品分類は必須項目です',
                                  },
                                  // {
                                  //     validator: validateCategoryIds,
                                  // },
                              ]}
                        >
                            <CategoryOptions/>
                        </Item>
                        <Item label="商品画像"
                        >
                            <PicturesWall ref={this.picWlRef} imgs={imgs}/>
                        </Item>
                        <Item label="商品詳細"
                              labelCol={{span: 2}} wrapperCol={{span: 20}}
                        >
                            <RichTextEditor ref={this.editorRef} detail={detail}/>
                        </Item>
                        <Item>
                            <Button type='primary' htmlType="submit">コミット</Button>
                        </Item>
                    </Form>
                </Card>
            </CategoryOptionsContext.Provider>
        );
    }
}

export default ProductAddUpdate;

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
