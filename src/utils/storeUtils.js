/*用于存储登录信息到localstorage*/

import store from 'store'

const KEY_VAL = 'user_key'

export default {

    /*保存user*/
    saveUser(user) {
        //localStorage.setItem(KEY_VAL, JSON.stringify(user))
        store.set(KEY_VAL, user)
    },

    /*读取user*/
    getUser(){
        //return JSON.parse(localStorage.getItem(KEY_VAL) || '{}')
        return store.get(KEY_VAL) || {}
    },

    /*删除user*/
    removeUser(){
        //return localStorage.removeItem(KEY_VAL)
        store.remove(KEY_VAL)
    },

}
