<template>
  <div class="flights_filter">
    <div class="filters_main">
      <div class="filters_path">单程: {{info.departCity}}-{{info.destCity}}/ {{info.departDate}}</div>
      <div class="filters_selects">
        <div class="select_item">
          <el-select placeholder="起飞机场" size="mini" v-model="airport" @change="filterChange">
            <el-option
              v-for="item in filterOptions.airport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="select_item">
          <el-select placeholder="起飞时间" size="mini" v-model="flightTimes" @change="filterChange">
            <el-option
              v-for="item in filterOptions.flightTimes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="select_item">
          <el-select placeholder="航空公司" size="mini" v-model="company" @change="filterChange">
            <el-option
              v-for="item in filterOptions.company"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="select_item">
          <el-select placeholder="机型" size="mini" v-model="sizes" @change="filterChange">
            <!-- :label 当前下拉框所显示的内容 -->
            <!-- :value 筛选时接收的值 -->
            <el-option
              v-for="item in filterOptions.sizes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="filters_btn">
      筛选:
      <el-button type="primary" round size="mini" class="is_plain" @click="handleClick">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    options: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 起飞机场
      airport: "",
      // 起飞时间
      flightTimes: "",
      company: "",
      sizes: "",
      isPlain: false
    };
  },
  computed: {
    filterOptions() {
      // 起飞机场

      // 需要将接收到的数据  转换为 组件需要的格式
      // 第一种方式
      // let airport = this.options.airport
      //   .filter(v => v)
      //   .map(v => ({ value: v, label: v }));
      // 第二种方式
      let airport = [];
      this.options.airport.forEach(v => {
        v && airport.push({ value: v, label: v });
      });
      // console.log(airport);
      // 起飞时间
      let flightTimes = this.options.flightTimes.map(v => {
        v.from = v.from < 10 ? "0" + v.from : v.from;
        v.to = v.to < 10 ? "0" + v.to : v.to;
        return { label: `${v.from}:00-${v.to}:00`, value: v.from + "/" + v.to };
      });

      // 航空公司
      let company = this.options.company.map(v => ({
        label: v,
        value: v
      }));
      // 机型
      let sizes = [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ];
      return { airport, flightTimes, company, sizes };
    }
  },
  methods: {
    handleClick() {
      console.log(this.airport, this.flightTimes, this.company, this.sizes);
    },
    filterChange() {
      // 把选中的值发送到父组件即可
      let filter = {
        airport: this.airport,
        flightTimes: this.flightTimes,
        company: this.company,
        sizes: this.sizes
      };
      // console.log(filter);
      this.$emit("filterChange", filter);
    }
  }
};
</script>

<style lang="less" scoped>
.flights_filter {
  .filters_main {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .filters_path {
      font-size: 13px;
    }
    .filters_selects {
      display: flex;
      .select_item {
        width: 120px;
        margin-left: 5px;
      }
    }
  }
  .filters_btn {
    padding: 10px 0;
    .is_plain {
      background-color: #ecf5ff;
      color: #4094ff;
      &:hover,
      &:focus {
        background-color: #4094ff;
        color: #fff;
      }
    }
  }
}
</style>