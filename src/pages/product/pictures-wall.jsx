import React, {Component} from 'react';
import {Upload, Modal, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from "../../api";
import PropTypes from "prop-types";
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    //props限制的另一种写法参考add-form.jsx
    static propTypes = {
        imgs:PropTypes.array,
    }

    constructor(props) {
        super(props)

        let fileList = []

        //如果传入了imgs属性
        const {imgs} = this.props
        if(imgs && imgs.length > 0){
            fileList = imgs.map((img, index) => ({
                uid: -index, //唯一标识符，不设置时会自动生成,为了避免与自动生成冲突，建议手动指定时设置负数
                name: img, //文件名
                status: 'done', //上传状态，不同状态展示颜色也会有所不同
                url: BASE_IMG_URL + img,
            }))
        }

        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList,//所有已上传图片的数组
        };
    }

    /*
    *返回所有已上传图片文件名的数组
     */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
     *隐藏Model
     */
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        console.log(file)
        //一旦上传成功，将当前 上传的file信息修正
        if (file.status === 'done') {
            const result = file.response //{ status:0, data: {name: "image-xxx.png", url: "xxx"} }
            if(result.status===0) {
                message.success("图片上传成功！")
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.success("图片上传失败o(╥﹏╥)o")
            }
        } else if (file.status === 'removed') { //删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status===0) {
                message.success("图片删除成功！")
            } else {
                message.success("图片删除失败o(╥﹏╥)o")
            }
        }

        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"
                    name="image"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
