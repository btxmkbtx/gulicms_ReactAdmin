import React, {Component} from 'react';
import {Card, List} from 'antd';
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategoryById, reqCategorys} from "../../api";

const Item = List.Item

/*product的详情子路由组件*/
class ProductDetail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    async componentDidMount() {
        //得到当前商品的分类ID和父分类ID
        const {pCategoryId, categoryId} = this.props.location.state
        if(pCategoryId==='0') { //一级商品下的分类
            const result = await reqCategoryById(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else { //二级分类下的商品
            /*
            //通过多个await方式发送多个请求，效率偏低：因为后一个await是在前一个请求成功返回后才发送
            const result1 = await reqCategoryById(pCategoryId)
            const result2 = await reqCategoryById(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            //多个await请求迸发方案：使用promise.all方法,只有都成功了，才正常处理
            const results = await Promise.all([reqCategoryById(pCategoryId), reqCategoryById(categoryId)])
            //results中的结果保存顺序与all方法内的数组下标一一对应
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name

            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {

        //拿到詳細リンクボタン传递过来的product行对象
        const {name, desc, price, detail, imgs} = this.props.location.state
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}}/>
                </LinkButton>

                <span>商品詳細</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品紹介：</span>
                            <span>{desc}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品価額：</span>
                            <span>{price}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">所属分類：</span>
                            <span>{cName1}{cName2? <span> <ArrowRightOutlined/> {cName2}</span> : ''}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品イメージ：</span>
                            <span>
                                {
                                    imgs.map(img => (
                                        <img className="product-img"
                                             key={img}
                                             src={BASE_IMG_URL + img}/>
                                    ))
                                }
                            </span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品詳細：</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}>
                            </span>
                        </span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;
