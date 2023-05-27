<template>
  <div class="full_parent center column" style="background: radial-gradient(white, dodgerblue)">
    <label style="margin: 30px;font-size: 30px;font-weight: 700">欢迎登录体育馆预约管理系统</label>
    <div class="column border" style="width: 350px;height: 300px;background-color: white;padding: 20px; align-items: center">
      <div class="center full_width">
        <label style="font-weight: 600;font-size: 25px;margin: 10px">登 录</label>
      </div>
      <div class="full_width" style="width: 300px">
        <el-input v-model="name"
                  placeholder="请输入用户名"
                  class="text_input"
                  size="large"
                  :prefix-icon="icon_user">

        </el-input>
      </div>
    <div class="full_width"  style="width: 300px">
      <el-input v-model="password"
                placeholder="请输入密码"
                type="password"
                class="text_input"
                size="large"
                show-password
                :prefix-icon="icon_lock">
      </el-input>
    </div>
      <el-button type="primary" size="large" @click="login(name, password)">
        登录
      </el-button>
    </div>
  </div>
</template>


<script>
import {User, Lock} from '@element-plus/icons-vue'
import * as req from '@/request'
import {userState} from "@/state/user";

export default {
  name: "LoginPage",
  data(){
    return{
      name: "",
      password:"",
      icon_user: User,
      icon_lock: Lock,
    }
  },
  methods: {
    login(name, pwd){
      req.post("/user/work_login", {
        name,
        password: pwd
      }).then((v) => {
        console.log(v)
        if(v.data.code == 1){
          this.$message.error(v.data.data)
        }else{
          userState().login(v.data.data)
          this.$router.push("/");
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>