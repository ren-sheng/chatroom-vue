import VueRouter from 'vue-router'
 
import ChatHome from '../view/home.vue'
import Login from '../view/login.vue'
import admin from '../view/admin.vue'
 
export default new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            path: "/ChatHome",
            name: "ChatHome",
            component: ChatHome,
        },
        {
            path: "/admin",
            name: "admin",
            component: admin,
        }
    ]
})