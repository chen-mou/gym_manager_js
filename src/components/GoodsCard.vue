<template>
  <el-card style="padding: 20px">
    <template #header>
      <div class="card-header">
        <label>{{ type_chinese }}预约情况</label>
        <div>
          <div style="width: 50px">
            <el-button @click="show_dialog=true">管理</el-button>
          </div>
        </div>
      </div>
    </template>
    <div class="full_width center" v-if="list.length == 0">
      <el-empty :description="date == '' ? '请选择一个日期' : '今天没有预约'"/>
    </div>
    <el-dialog v-model="show_dialog" style="height: 60%">
      <el-card>
        <template #header>
          <div class="card-header">
            <label>{{ type_chinese }}管理</label>
            <div>
              <div style="width: 50px">
                <el-button @click="createOrUpdate(1)">添加商品</el-button>
              </div>
            </div>
          </div>
        </template>
        <div class="full_width center" v-if="goods_list.length == 0">
          <el-empty :description="'没有商品'"/>
        </div>
        <el-table v-if="goods_list.length != 0" :data="goods_list">
          <el-table-column prop="name" label="名称"/>
          <el-table-column v-if="type=='Equipment'" prop="number" label="剩余数量"/>
          <el-table-column v-if="type=='Equipment'" prop="total" label="总数"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <div class="row">
                <el-popover :visible="now_delete == scope.row.id" placement="top">
                  <p>是否删除</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" text @click="now_delete = -1">返回</el-button>
                    <el-button size="small" type="primary" @click="this.delete(scope.row.id)"
                    >确认</el-button
                    >
                  </div>
                  <template #reference>
                    <el-button @click="now_delete = scope.row.id">删除</el-button>
                  </template>
                </el-popover>
                <el-button @click="createOrUpdate(2, scope)">修改</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
    <el-dialog v-model="show_save" @closed="closeSave">
      <el-card>
        <template #header>
          <label>{{show_save == 1 ? '创建' : '更新'}}{{type_chinese}}</label>
        </template>
        <el-form>
          <el-form-item :label="type_chinese + '头像'">
            <el-upload
                class="avatar-uploader"
                :multiple="false"
                :action="baseUrl+'goods/uploadAvatar'"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatar" :src="avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item :label="type_chinese + '名'">
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input-number v-model="price" :precision="2" :step="0.01"></el-input-number>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="unit"></el-input>
          </el-form-item>
          <el-form-item v-if="type == 'Equipment'" label="器材数量">
            <el-input-number v-model="number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="closeSave">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
    <el-table v-if="list.length != 0" :data="list" stripe>
      <el-table-column prop="goods.name" :label="type_chinese + '名'"/>
      <el-table-column prop="start" label="起始时间"/>
      <el-table-column prop="end" label="结束时间"/>
      <el-table-column prop="number" label="数量" v-if="type == 'Equipment'"/>
    </el-table>
  </el-card>
</template>

<script>
import {get, baseURL} from '../request'
import {post} from "../request";
import {Plus} from "@element-plus/icons-vue";


export default {
  name: "GoodsCard",
  components: {Plus},
  props: ["type", "date"],
  mounted() {
    switch (this.type) {
      case "Venue":
        this.type_chinese = "场馆"
        break;
      case "Equipment":
        this.type_chinese = "器材"
    }
  },
  data() {
    return {
      "type_chinese": "",
      "list": [],
      "goods_list": [],
      "show_dialog": false,
      "now_delete": -1,
      "now_select": -1 ,
      "show_save": 0,
      "name": "",
      "avatar": "",
      "price": 0,
      "unit": "",
      "id": 0,
      "number": 1,
      "baseUrl": baseURL,
    }
  },
  watch: {
    date() {
      if (this.date != "" && this.date != null) {
        get(`/order/getGymReserve?type=${this.type}&date=${this.date.toLocaleDateString()}`).then(res => {
          if (res.data.code != 0) {
            this.$message.error(res.data.data)
            return
          }
          this.list = res.data.data
        })
      }
    },
    show_dialog() {
      if (this.show_dialog) {
        this.getGoods()
      }
    }
  },
  methods:{
    getGoods(){
      get(`/goods/getByWorkerAndType?type=${this.type}`).then(
          (res) => {
            if (res.data.code != 0) {
              this.$message.error(res.data.data)
              return
            }
            this.goods_list = res.data.data
          }
      )
    },
    delete(id){
      post("/goods/delete", {
        "id": id
      }).then((res) => {
        if(res.data.code == 1){
          this.$message.error(res.data.data)
        }else{
          this.$message.success(res.data.data)
          this.getGoods()
        }
        this.now_delete = -1;
      })
    },
    createOrUpdate(show, scope){
      this.show_save = show
      if(scope != null){
        this.name = scope.row.name
        this.avatar = scope.row.avatar
        this.price = scope.row.price
        this.unit = scope.row.unit
        this.id = scope.row.id
        this.number = scope.row.total
      }
    },
    submit(){
      post("/goods/save", {
        name: this.name,
        avatar: this.avatar,
        price: this.price,
        unit: this.unit,
        number: this.number,
        id: this.id,
        type: this.type
      }).then(res => {
        if(res.data.code != 0){
          this.$message.error(res.data.data)
          return
        }
        this.$message.success(`${this.show_save == 1 ? "创建" : "更新"}成功`)
        this.closeSave()
        this.getGoods()
      })
    },
    closeSave(){
      this.show_save = 0
      this.name = ""
      this.avatar = ""
      this.price = 0
      this.unit = ""
      this.id = 0
    },
    beforeAvatarUpload(rawFile){
      let r = /image\/(.*)/g
      if (!r.test(rawFile.type)) {
        this.$message.error('必须是个图片!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 5) {
        this.$message.error('文件大小不能超过2MB!')
        return false
      }
      return true
    },
    handleAvatarSuccess(res){
      if(res.code != 0){
        this.$message.error(res.data.data)
        return;
      }
      this.avatar = res.data
      console.log(this.avatar)
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>