import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import userManage from '../components/userManage.vue'
import address from '../components/address.vue'
import orders from '../components/Orders.vue'
import bookMessage from '../components/bookMessage.vue'
import shopCart from'../components/shopCart.vue'
import personInfo from '../components/personInfo.vue'
import myOrders from '../components/myOrders'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Login,
        },{
            path: '/Home',
            component: Home,
            redirect: { path: '/1' },
            children: [
                {
                    path: '/1',
                    component: welcome
                },
                {
                  path: '/2',
                  component:orders
                },
               {
                    path: '/3',
                    component: userManage
                }, {
                    path: '/4',
                    component: bookMessage
                }, {
                    path: '/5',
                    component: shopCart
                }, {
                    path: '/6',
                    component: address
                }, {
                    path: '/7',
                    component: myOrders
                },
              {
                path: '/8',
                component: personInfo
              }
            ]
        }
    ]
})
