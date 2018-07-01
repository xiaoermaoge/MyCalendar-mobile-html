// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Login from './page/Login.vue'
import Bind from './page/Bind.vue'
import UserPage from './page/UserPage.vue'

import ViewRoomList from './components/ViewRoomList.vue'
import OrderRoom from './components/OrderRoom.vue'
import MyOrder from './components/MyOrder.vue'
import MyHome from './components/MyHome.vue'
import ViewMeeting from './components/ViewMeeting.vue'
import Reserve from './components/Myreserve.vue'

import  {LoadingPlugin} from 'vux'
Vue.use(LoadingPlugin)

import ComponentAPI from './api/Component'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Login
    }, {
        path: '/bind',
        component: Bind
    }, {
        path: '/user',
        component: UserPage,
        name: '用户操作',
        children: [
            {path: 'viewRoomList', component: ViewRoomList, name: 'viewRoomList'},
            {path: 'orderRoom', component: OrderRoom, name: 'orderRoom'},
            {path: 'myOrder', component: MyOrder, name: 'myOrder'},
            {path: 'myHome', component: MyHome, name: 'myHome'},
            {path: 'viewMeeting', component: ViewMeeting, name: 'viewMeeting'},
        ]
    },{
        path: '/reserve',
        component: Reserve
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

// 导航守卫
router.beforeEach(async (to, from, next) => {
    let isWechat = await ComponentAPI.checkIsWechat();
    if (isWechat) {
        let result = await ComponentAPI.checkLogin();
        if (result.status) {
            if (to.fullPath == "/") {
                next("/user/viewRoomList");
            } else {
                next();
            }
        } else {
            if(to.fullPath == "/bind"){
                next();
            } else {
                window.location.href = "/web/auth?redirect_url=" + encodeURIComponent(window.location.href);
            }
        }
    } else {
        let result = await ComponentAPI.checkLogin();
        if(result.status){
            if (to.fullPath == "/") {
                next("/user/viewRoomList");
            } else {
                next();
            }
        } else {
            if (to.fullPath == "/") {
                next();
            } else {
                next("/");
            }
        }
    }
});

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box')
