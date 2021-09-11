import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input} from 'antd'

const Item = Form.Item

class AddForm extends Component {

    formRef = React.createRef();

    componentDidMount() {
        //将form对象，通过调用父组件传递来的setForm函数，执行父组件的setForm逻辑，将子组件form实例挂载到父组件的this中
        this.props.setForm(this.formRef.current)
    }

    //动态刷新父组件传递进来的初期值
    componentDidUpdate() {

        this.formRef.current.setFieldsValue({

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

        return (
            <Form {...formItemLayout}
                ref={this.formRef}
            >
                <Item label="角色名称" name="roleName"
                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                      rules={[
                          {
                              required: true,
                              message: 'ロール名は必須項目です！',
                          },
                      ]}
                >
                    <Input placeholder='ロール名称を入力してください'/>
                </Item>
            </Form>
        );
    }
}

//props限制的另一种写法参考update-form.jsx
AddForm.propTypes = {
    setForm:PropTypes.func.isRequired,
}

export default AddForm;
