<template>
  <div id="xyly_index">
    <!-- 轮播图开始 -->
    <div class="index_carousel">
      <el-carousel height="700px">
        <el-carousel-item v-for="(item,index) in swiperList" :key="index">
          <div
            :style="`background:url(${$axios.defaults.baseURL+item.url}) center center;height:700px;`"
          ></div>
        </el-carousel-item>
      </el-carousel>
      <!-- tabs栏开始 -->
      <div class="index_tabs">
        <TypesTab />
      </div>
      <!-- tabs栏结束 -->
    </div>
    <!-- 轮播图结束 -->
  </div>
</template>

<script>
import TypesTab from "@/components/index/TypesTab.vue";
export default {
  components: { TypesTab },
  data() {
    return {
      swiperList: []
    };
  },
  asyncData(context) {
    //获取首页轮播图
    // app:Vue 根实例
    const $axios = context.app.$axios;
    return $axios.get("/scenics/banners").then(res => {
      console.log(res);
      return {
        swiperList: res.data.data
      };
    });
  }
  // mounted() {
  //   this.$axios.get("/scenics/banners").then(res => {
  //     console.log(res);
  //     this.swiperList = res.data.data;
  //   });
  // }
};
</script>

<style lang="less" scoped>
.xyly_index {
  min-width: 1000px;
}
.index_carousel {
  position: relative;
  .index_tabs {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }
}
</style>