import React, {Component} from 'react';
import {Form, Input, Button, message, Cascader } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storeUtils from "../../utils/storeUtils";
import logo from "../../assets/images/logo.png";

const optionLists = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
];

const LazyOptions = () => {
    const [options, setOptions] = React.useState(optionLists);

    const onOptionsChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };

    const loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                },
            ];
            setOptions([...options]);
        }, 1000);
    };

    return <Cascader options={options} loadData={loadData} onChange={onOptionsChange} changeOnSelect />;
};

const onFinish = async (values) => {
    console.log('提交ajax请求: ', values);

};

export default function Test() {

    const validateCascader = (getFieldValue) => ({
        validator(_, value) {
            console.log(value)//
            if (value) {
                return Promise.resolve();
            }
            console.log('^^^^^^^^^')//
            console.log(getFieldValue('myCascader'))//
            return Promise.reject(new Error('選択を入力してください!'));
        },
    })

    return (
        <div>
            <Form
                name="normal_login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="myCascader"
                    rules={[
                        {
                            // required: true,
                            // message: 'Please input your Password!',
                        },
                        ({ getFieldValue }) => validateCascader(getFieldValue),
                    ]}
                >
                    <LazyOptions />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

}
