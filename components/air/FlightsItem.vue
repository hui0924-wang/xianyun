<template>
  <div class="flights_item">
    <div class="item_main" @click="isShow=!isShow">
      <div class="item_name">{{data.airline_name}}{{data.flight_no}}---{{data.plane_size}}</div>
      <div class="item_depart_date">
        <P>{{data.dep_time}}</P>
        <p>{{data.org_airport_name}}{{data.org_airport_quay}}</p>
      </div>
      <div class="duration">{{duration}}</div>
      <div class="item_dest_date">
        <p>{{data.arr_time}}</p>
        <p>{{data.dst_airport_name}}{{data.dst_airport_quay}}</p>
      </div>
      <div class="item_price">
        <p>
          ￥
          <span>{{data.base_price*0.5}}</span>
          起
        </p>
      </div>
    </div>
    <div class="item_info" v-show="isShow">
      <div class="item_low">低价推荐</div>
      <div class="item_seat">
        <div class="seat_row" v-for="(item,index) in data.seat_infos" :key="index">
          <div class="seat_row_name">
            <span>{{item.name}}</span>
            &nbsp; | {{item.supplierName}}
          </div>
          <div class="seat_row_price">￥{{item.settle_price}}</div>
          <div class="seat_row_btns">
            <div>
              <el-button type="warning" size="mini">选定</el-button>
              <p>剩余:{{item.discount}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  computed: {
    duration() {
      // 第一种是常规的计算时间差的方式
      // 方式二  =========两个时间格式 是可以 做减法运算的==========
      let startTime = this.data.dep_datetime;
      let endTime = this.data.arr_datetime;

      let startDate = new Date(startTime);
      let endDate = new Date(endTime);
      // console.log(startDate)
      // console.log(endDate)

      // duration 格式 :一个数字  毫秒
      let duration = endDate - startDate;
      // console.log(duration)

      // XX小时
      let hour = parseInt(duration / 1000 / 60 / 60);
      // console.log(hour)
      // xx分
      let minutes = parseInt(duration / 1000 / 60 - hour * 60);
      // console.log(`${hour}时${minutes}分`);
      return `${hour}时${minutes}分`;
    }
  }
};
</script>

<style lang="less" scoped>
.flights_item {
  border: 1px solid #ccc;
  margin: 10px 0;
  .item_main {
    display: flex;
    height: 80px;
    position: relative;
    > div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 13px;
    }

    .item_depart_date,
    .item_dest_date {
      p:nth-child(1) {
        font-size: 25px;
      }
      p:nth-child(2) {
        font-size: 12px;
        color: #666;
      }
    }
    .item_price {
      span {
        color: orange;
        font-size: 20px;
      }
    }
    .duration {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      padding: 0 5px 10px;
      border-bottom: 1px solid #ccc;
    }
  }
  .item_info {
    display: flex;
    background-color: #f6f6f6;
    .item_low {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
    }
    .item_seat {
      flex: 5;
      .seat_row {
        display: flex;
        height: 70px;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: none;
        }
        > div {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .seat_row_name {
          flex: 4;
          font-size: 13px;
          span {
            color: orange;
          }
        }
        .seat_row_price {
          flex: 1;
          font-size: 18px;
          color: orange;
        }
        .seat_row_btns {
          flex: 1;
          font-size: 13px;
          p {
            padding-top: 5px;
          }
        }
      }
    }
  }
}
</style>