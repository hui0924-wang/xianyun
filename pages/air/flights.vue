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
    <div class="flights_aside">
      <div class="help">
        <div class="el-row">
          <div class="el-col el-col-8">
            <i class="iconfont iconweibiaoti-_huabanfuben" style="color:#409EFF"></i>
            <span>航协认证</span>
          </div>
          <div class="el-col el-col-8">
            <i class="iconfont iconbaozheng" style="color:#008000"></i>
            <span>出行保证</span>
          </div>
          <div class="el-col el-col-8">
            <i class="iconfont icondianhua" style="color:#409EFF"></i>
            <span>7X24</span>
          </div>
        </div>
        <div class="phone">免费客服电话 : 4006345678转2</div>
      </div>
      <div class="history">
        <div class="history_title">历史查询</div>
        <div class="history_content">
          <div class="history_row" v-for="(item,index) in historyList" :key="index">
            <div class="his-left">
              <p>{{item.departCity}} - {{item.destCity}}</p>
              <p>{{item.departDate}}</p>
            </div>
            <div class="his-right">
              <el-button size="mini" type="warning">选择</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      },
      // 历史记录
      historyList: []
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
      console.log(filterObj);

      let filterList = this.flightsData.flights.filter(v => {
        // 先过滤第一个条件 航空公司
        // 当航空公司过滤条件即filterObj.company 等于空字符串 或者 filterObj.company等于this.flightsData.flights.airline_name时  不过滤
        let isOk1 =
          filterObj.company === "" || filterObj.company === v.airline_name;

        // 起飞机场
        let isOk2 =
          filterObj.airport === "" || filterObj.airport === v.org_airport_name;

        // 机型
        let isOk3 = filterObj.sizes === "" || filterObj.sizes === v.plane_size;

        // 起飞时间
        // 只拿完整数据中 起飞时间（dep_time） 和 筛选条件中的 from | to 做比较即可 (6|12)
        // 1. 获取 条件中的 开始时间
        // 1.2 格式要注意 字符串的格式 加减运算
        let flightTimes_from = filterObj.flightTimes.split("/")[0] - 0;
        let flightTimes_to = filterObj.flightTimes.split("/")[1] - 0;
        // 把 6:30 => 6.5 格式
        let dep_time_start =
          v.dep_time.split(":")[0] - 0 + (v.dep_time.split(":")[1] / 60 - 0);
        //开始作比较
        let isOk4 =
          filterObj.flightTimes === "" ||
          (dep_time_start >= flightTimes_from &&
            dep_time_start <= flightTimes_to);
        return isOk1 && isOk2 && isOk3 && isOk4;
      });
      console.log(filterList);
      this.filterList = filterList;

      // 重新获取机票列表 进行分页
      this.getList();
    }
  },
  mounted() {
    // 重新获取机票列表 进行分页
    this.getList(true);
    this.historyList = JSON.parse(localStorage.getItem("city"));
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
    margin-left: 15px;
    margin-top: 20px;
    .help {
      border: 1px solid #ccc;

      .el-row {
        width: 100%;
        display: flex;
        padding: 10px 0;
        > div {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-content: center;
          > i {
            width: 100%;
            font-size: 40px;
            text-align: center;
          }
          > span {
            font-size: 12px;
          }
        }
      }
      .phone {
        font-size: 14px;
        padding: 10px 10px;
        background-color: #f6f6f6;
      }
    }
    .history {
      margin-top: 10px;
      border: 1px solid #ccc;
      padding: 0 10px;
      .history_title {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
      }
      .history_row {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: none;
        }
        .his-left {
          > p:nth-child(1) {
            font-size: 14px;
            margin: 0 0 5px;
          }
          > p:nth-child(2) {
            font-size: 12px;
            color: #666;
          }
        }
        .his-right {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>