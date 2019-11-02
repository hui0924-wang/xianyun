<template>
  <div class="search_form">
    <div class="search_title">
      <div
        class="title_item"
        v-for="(item,index) in ['单程','往返']"
        :key="index"
        :class="currentIndex===index?'active':''"
        @click="currentIndex=index"
      >{{item}}</div>
    </div>
    <div class="search_content">
      <el-form label-width="80px">
        <el-form-item label="出发城市">
          <el-autocomplete
            placeholder="请输入内容"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect1"
            v-model="form.departCity"
          ></el-autocomplete>
        </el-form-item>
        <!-- 换 -->
        <div class="city_change" @click="handleCityChange">换</div>
        <!-- 换 -->
        <el-form-item label="到达城市">
          <el-autocomplete
            placeholder="请输入内容"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect2"
            v-model="form.destCity"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="出发时间">
          <el-col>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              v-model="form.departDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleGetTicket">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      form: {
        // 出发城市
        departCity: "上海",
        // 出发城市编码
        departCode: "SHA",
        // 出发日期
        departDate: "2019-11-28",
        // 到达城市
        destCity: "广州",
        // 到达城市编码
        destCode: "CAN"
      }
    };
  },
  methods: {
    querySearchAsync(queryString, callBack) {
      // queryString ：搜索框当前输入的值
      // console.log(queryString);
      if (queryString) {
        this.$axios
          .get("/airs/city", { params: { name: queryString } })
          .then(res => {
            // console.log(res);
            let cityArr = res.data.data;
            cityArr.forEach(v => {
              // 把广州市的""市" 去掉 ，后台不需要"市"
              v.name = v.name.replace("市", "");
              v.value = v.name;
            });
            callBack(cityArr);
          });
      }
    },
    handleSelect1(item) {
      // console.log(item);
      this.form.departCode = item.sort;
    },
    handleSelect2(item) {
      // console.log(item);
      this.form.destCode = item.sort;
    },
    handleCityChange() {
      // 使用简单的  对象  深拷贝 方法
      // 有小弊端： 对象中如果有 属性 = 函数格式 ,深拷贝会导致属性丢失！！！！
      // let form = JSON.parse(JSON.stringify(this.form));
      // // console.log(this.form);
      // // console.log(form === this.form);  //false
      // this.form.departCity = form.destCity;
      // this.form.departCode = form.destCode;
      // this.form.destCity = form.departCity;
      // this.form.destCode = form.departCode;
      // ===================以下用法比较高级===================
      // 用es6语法
      [
        this.form.departCity,
        this.form.departCode,
        this.form.destCode,
        this.form.destCity
      ] = [
        this.form.destCity,
        this.form.destCode,
        this.form.departCode,
        this.form.departCity
      ];
    },
    handleGetTicket() {
      // 路由跳转 编程式导航
      this.$router.push({ name: "air-flights", query: this.form });
      // 从本地存储获得搜索历史记录
      let cityStr = localStorage.getItem("city");
      let arr = [];
      if (cityStr) {
        arr = JSON.parse(cityStr);
      }
      // 查重
      const index = arr.findIndex(
        v => JSON.stringify(this.form) === JSON.stringify(v)
      );
      console.log(index);
      if (index !== -1) {
        // 删除原重复的
        arr.splice(index, 1);
      }
      // 添加新的搜索值
      arr.unshift(this.form);
      console.log(arr);
      // 重新存储到本地存储
      localStorage.setItem("city", JSON.stringify(arr));
    }
  }
};
</script>

<style lang="less" scoped>
.search_form {
  .search_title {
    height: 50px;
    display: flex;
    .title_item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #eee;
    }
    .active {
      background-color: #fff;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 3px;
        background-color: orange;
      }
    }
  }
  .search_content {
    padding: 20px 50px 20px 25px;
    position: relative;
    .city_change {
      position: absolute;
      top: 60px;
      right: 15px;
      width: 22px;
      height: 22px;
      background-color: #666;
      color: #fff;
      font-size: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &::before {
        content: "";
        position: absolute;
        top: -21px;
        left: -14px;
        width: 25px;
        height: 20px;
        border: 1px solid #ccc;
        border-left: none;
        border-bottom: none;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: -21px;
        left: -14px;
        width: 25px;
        height: 20px;
        border: 1px solid #ccc;
        border-left: none;
        border-top: none;
      }
    }
  }
}
</style>