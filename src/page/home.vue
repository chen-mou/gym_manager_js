<template>
  <div class="full_parent" style="padding: 50px">
    <div class="full_width" style="margin: 20px 20px 20px 50px;">
      <el-date-picker v-model="dateValue" type="date" placeholder="选择一个日期" format="YYYY/MM/DD" :default-value="today" >

      </el-date-picker>
    </div>
    <div class="full_width" style="height: 80%;display: flex;justify-content: start">
      <goods-card :date="dateValue" type="Venue" class="card">

      </goods-card>
      <goods-card :date="dateValue" type="Equipment" class="card">

      </goods-card>
    </div>
  </div>
</template>

<script>
import GoodsCard from "@/components/GoodsCard";
export default {
  name: "HomePage",
  data(){
    console.log((new Date()).toLocaleDateString())
    return {
      "dateValue": "",
      "today": new Date()
    }
  },
  components: {GoodsCard}
}
</script>

<style scoped>

.card{
  /*box-shadow: 2px 2px 2px #000000;*/
  /*border: 1px solid #000000;*/
  /*border-radius: 10px;*/
  width: 30%;
  height: 80%;
  background: white;
  margin: 50px;
}

</style>