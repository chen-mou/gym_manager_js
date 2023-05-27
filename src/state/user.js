import {defineStore, acceptHMRUpdate} from 'pinia'

export const userState = defineStore('user', {
    state: () => {
        return {
            user: {},
            isLogin: false,

        }
    },
    actions: {
        login(user){
            console.log(this)
            this.user = user;
            this.isLogin = true
        }
    }
})

if(import.meta.hot){
    import.meta.hot.accecpt(acceptHMRUpdate(userState, import.meta.hot))
}