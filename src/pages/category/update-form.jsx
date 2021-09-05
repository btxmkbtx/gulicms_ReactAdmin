import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input} from 'antd'

const Item = Form.Item

class UpdateForm extends Component {

    //props限制的另一种写法参考add-form.jsx
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired,
    }

    formRef = React.createRef();

    componentDidMount() {
        //将form对象，通过调用父组件传递来的setForm函数，执行父组件的setForm逻辑，将子组件form实例挂载到父组件的this中
        this.props.setForm(this.formRef.current)
    }

    //动态刷新父组件传递进来的初期值
    componentDidUpdate() {
        const {categoryName} = this.props
        this.formRef.current.setFieldsValue({
            categoryName:categoryName,
        });

        //刷新返回给父节点的form实例,防止父节点拿到缓存记忆中的实例
        this.props.setForm(this.formRef.current)
    }

    render() {
        const {categoryName} = this.props
        return (
            <Form
                ref={this.formRef}
                initialValues={{//initialValues的动态刷新要使用setFieldsValue来完成
                    categoryName:categoryName,
                }}
            >
                <Item name="categoryName"
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

export default UpdateForm;
