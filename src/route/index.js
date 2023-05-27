import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/page/login";
import {userState} from '@/state/user'
import home from "@/page/home";




const router = createRouter(
    {
        routes: [
            {
                path: "/login",
                component: Login,
            },
            {
                path: "/",
                component: home,
                meta: {
                    needLogin: true
                }
            }
        ],
        history: createWebHistory(),
}
)

router.beforeEach(async (to) => {
    let state = userState()
    if(to.meta != null && to.meta.needLogin && !state.isLogin){
        router.push("/login")
    }
})

export {router}