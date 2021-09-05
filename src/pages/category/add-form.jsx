import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

    formRef = React.createRef();

    componentDidMount() {
        //将form对象，通过调用父组件传递来的setForm函数，执行父组件的setForm逻辑，将子组件form实例挂载到父组件的this中
        this.props.setForm(this.formRef.current)
    }

    //动态刷新父组件传递进来的初期值
    componentDidUpdate() {
        const {parentId} = this.props
        this.formRef.current.setFieldsValue({
            parentId:parentId,
            categoryName:'',
        });

        //刷新返回给父节点的form实例,防止父节点拿到缓存记忆中的实例
        this.props.setForm(this.formRef.current)
    }

    render() {
        //定义form栅格布局
        const formItemLayout = {
            labelCol: {
                span: 4, //指定左侧label宽度
            },
            wrapperCol: {
                span: 16, //指定右侧包裹宽度
            }
        };

        const {categories, parentId} = this.props

        return (
            <Form {...formItemLayout}
                ref={this.formRef}
                initialValues={{//initialValues的动态刷新要使用setFieldsValue来完成
                    parentId:parentId,
                    categoryName:'',
                }}
            >
                <Item label="品目種類" name="parentId">
                    <Select>
                        {/*默认key为0，为了不和下面的遍历代码生成的第一条key冲突，手动把第一项的key改成-1*/}
                        <Option key="-1" value='0'>ルート種類</Option>
                        {
                            categories.map((c, index) => <Option key={index} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>

                <Item label="品目名称" name="categoryName"
                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                      rules={[
                          {
                              required: true,
                              message: '品目名は必須項目です！',
                          },
                      ]}
                >
                    <Input placeholder='分類名称を入力してください'/>
                </Item>
            </Form>
        );
    }
}

//props限制的另一种写法参考update-form.jsx
AddForm.propTypes = {
    setForm:PropTypes.func.isRequired,//用来传递form对象的函数
    categories:PropTypes.array.isRequired,//必须把已经取得的一级分类数组，从父组件传给子组件
    parentId:PropTypes.string.isRequired, //必须要用父分类ID来控制下拉框的初期值
}

export default AddForm;
