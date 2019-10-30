<template>
  <div class="flights">
    <!-- 正文 开始 -->
    <div class="flights_main">
      <!-- 1.筛选模块 开始 -->
      <FlightsFilter
        v-if="flightsData.flights.length"
        :info="flightsData.info"
        :options="flightsData.options"
        @filterChange="filterChange"
      />
      <!-- 1.筛选模块 结束 -->

      <!-- 2.表单的头部开始  -->
      <FlightsHead />
      <!-- 2.表单的头部结束  -->

      <!-- 3.机票列表开始 -->
      <div class="air_list">
        <FlightsItem v-for="item in currentFlights" :key="item.id" :data="item" />
      </div>
      <!-- 3.机票列表结束 -->
      <!-- 4.分页组件开始 -->
      <div class="pagination">
        <!-- 
        current-page     当前页码
        page-sizes:      页容量 数组
        page-size:       当前 页容量  
        total:           总条数
        @size-change:    页容量改变事件
        @current-change:   页码改变事件-->
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 4.分页组件结束 -->
    </div>

    <!-- 正文结束 -->

    <!-- 4.侧边栏开始 -->
    <div class="flights_aside">侧边栏</div>
    <!-- 4.侧边栏结束 -->
  </div>
</template>

<script>
import FlightsItem from "@/components/air/FlightsItem";
import FlightsFilter from "@/components/air/FlightsFilter";
import FlightsHead from "@/components/air/FlightsHead";
export default {
  data() {
    return {
      flightsData: {
        // 机票列表 数组
        flights: [],
        info: {},
        options: {},
        total: ""
      },
      // 筛选后的数据源  第一次加载时 数据源=总的数据源
      filterList: [],
      // 被分页后的 机票列表
      currentFlights: [],

      // 分页对象
      page: {
        // 当前页码
        currentPage: 1,
        // 页容量数组
        pageSizes: [1, 2, 4, 6, 8, 10],
        // 页容量
        pageSize: 10,
        // 总条数
        total: 1
      }
    };
  },
  components: {
    FlightsItem,
    FlightsFilter,
    FlightsHead
  },
  methods: {
    getList(isFirst) {
      if (isFirst) {
        // console.log(this.$route.query);
        let form = this.$route.query;
        this.$axios.get("/airs", { params: form }).then(res => {
          console.log(res);
          // 定义 总数据源
          this.flightsData = res.data;

          // 定义过滤后 数组的数据源 初次加载 ===总数据源
          this.filterList = this.flightsData.flights;
          // 定义 总条数
          this.page.total = this.filterList.length;
          // 需要 实现数组分页 对this.flightsData.flights进行处理
          // 筛选后对this.filterList进行处理
          // let list =totalList.slice(
          // (当前的页码-1)*当前的页容量 ,
          // 当前的页码* 当前的页容量
          // )
          // 分页使用
          this.currentFlights = this.filterList.slice(
            (this.page.currentPage - 1) * this.page.pageSize,
            this.page.currentPage * this.page.pageSize
          );
        });
      } else {
        //定义总条数 （属于过滤后的 总条数）
        this.page.total = this.filterList.length;
        // 分页
        this.currentFlights = this.filterList.slice(
          (this.page.currentPage - 1) * this.page.pageSize,
          this.page.currentPage * this.page.pageSize
        );
      }
    },
    handleSizeChange(value) {
      // console.log(value);
      this.page.pageSize = value;
      // 重新分页
      this.getList();
    },
    handleCurrentChange(value) {
      // console.log(value);
      this.page.currentPage = value;
      // 重新分页
      this.getList();
    },
    filterChange(filterObj) {
      // console.log(filterObj);
      // 先过滤第一个条件 航空公司
      // 当航空公司过滤条件即filterObj.company 等于空字符串 或者 filterObj.company等于this.flightsData.flights.airline_name时  不过滤
      let filterList = this.flightsData.flights.filter(v => {
        let isOk1 =
          filterObj.company === "" || filterObj.company === v.airline_name;
        return isOk1;
      });
      // console.log(filterList);
      this.filterList = filterList;
      // 重新获取机票列表 进行分页
      this.getList();
    }
  },
  mounted() {
    // 重新获取机票列表 进行分页
    this.getList(true);
  }
};
</script>

<style lang="less" scoped>
.flights {
  display: flex;
  width: 1000px;
  margin: 0 auto;
  .flights_main {
    flex: 5;
    .pagination {
      display: flex;
      justify-content: center;
      padding: 10px 0;
    }
  }
  .flights_aside {
    flex: 2;
  }
}
</style>