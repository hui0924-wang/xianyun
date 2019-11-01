<template>
  <div class="bill">
    <div class="flight">
      <div class="top">
        <span>{{ticket.dep_date}}</span>
        <span>{{ticket.org_city_name}} - {{ticket.dst_city_name}}</span>
      </div>
      <div class="content">
        <div class="depart">
          <p>{{ticket.dep_time}}</p>
          <p>{{ticket.org_airport_name}}{{ticket.org_airport_quay}}</p>
        </div>
        <div class="duration">
          <p>---{{duration}}---</p>
          <p>{{ticket.airline_name}}{{ticket.flight_no}}</p>
        </div>
        <div class="dest">
          <p>{{ticket.arr_time}}</p>
          <p>{{ticket.dst_airport_name}}{{ticket.dst_airport_quay}}</p>
        </div>
      </div>
    </div>
    <div class="price">
      <div class="price_title">
        <span>订单总价</span>
        <span>金额</span>
        <span>数量</span>
      </div>
      <div class="price_ticket">
        <span>成人机票</span>
        <span>¥{{ticket.base_price}}</span>
        <span>×1</span>
      </div>
      <div class="price_oil">
        <span>机建+燃油</span>
        <span>¥{{ticket.airport_tax_audlet}}/人/单程</span>
        <span>×1</span>
      </div>
      <div class="price_total">
        <span>应付总额</span>
        <span>¥ {{price}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticket: {
      type: Object,
      default: {}
    },
    price: {
      type: Number,
      dafault: 0
    }
  },
  computed: {
    duration() {
      // 第一种是常规的计算时间差的方式
      // 方式二  =========两个时间格式 是可以 做减法运算的==========
      let startTime = this.ticket.dep_datetime;
      let endTime = this.ticket.arr_datetime;

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
  },
  mounted() {
    setTimeout(() => {
      console.log(this.ticket);
    }, 2000);
  }
};
</script>

<style lang="less" scoped>
.bill {
  width: 350px;
  border: 1px solid #ccc;
  .flight {
    padding: 15px;

    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .depart,
      .dest {
        p:nth-child(1) {
          font-size: 22px;
          line-height: 40px;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: #999;
        }
      }
      .duration {
        color: #999;
        font-size: 12px;
      }
    }
  }
  .price {
    font-size: 14px;
    color: #666;
    .price_title,
    .price_ticket,
    .price_oil,
    .price_total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border-top: 1px dashed #ccc;
    }
    .price_total {
      > span:nth-child(2) {
        font-size: 28px;
        color: #ffa500;
      }
    }
  }
}
</style>