/*
包含应用中所有接口请求函数的模块
本次采用分别暴露的写法
本次所有的接口型函数命名都用req开头
*/

/*//统一暴露写法
export default {
    xxx(){},
    yyy(){}
}*/

import ajax from "./ajax";
import product from "../pages/product/product";


//登录
/*export function reqLogin(username, password) {
    return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

// 获取单个分类
export const reqCategoryById = (categoryId) => ajax('/manage/category/info', {categoryId})

// 添加分类 注意参数写法方式一：分别定义参数
export const reqAddCategory = (parentId, categoryName) =>
    ajax('/manage/category/add', { categoryName, parentId }, 'POST')

// 更新品类名称 注意参数写法方式二：对象式定义参数,这样在调用时就要传递一个相同结构的对象
export const reqUpdateCategory = ({categoryId, categoryName}) =>
    ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

export const reqUpdateStatus = (productId, status) =>
    ajax('/manage/product/updateStatus', {productId, status}, 'POST')

/*
搜索商品分页列表(根据商品名称/商品描述)
*searchType:搜索的类型, productName/productDesc; 这就避免了分别为productName/productDesc写两个方法
*/
export const reqSearchProducts = ({pageNum, pageSize, searchKeyWord, searchType}) =>
    ajax('/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchKeyWord,
    })

/*
删除指定名称图片
 */
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id?'update':'add'), product, 'POST')

//获取所有角色的列表
export const reqRoles = () => ajax('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
