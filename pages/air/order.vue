<template>
  <div class="order">
    <!-- 主要内容 -->
    <div class="order_main">
      <OrderForm :ticket="ticket" @countPrice="countPrice" />
    </div>
    <!-- 侧边账单模块 -->
    <div class="order_aside">
      <OrderBill :ticket="ticket" :price="price" />
    </div>
  </div>
</template>

<script>
import OrderForm from "@/components/air/OrderForm";
import OrderBill from "@/components/air/OrderBill";
export default {
  components: {
    OrderForm,
    OrderBill
  },
  data() {
    return {
      ticket: {},
      price: 0
    };
  },
  mounted() {
    // console.log(this.$route.query);
    this.$axios
      .get("/airs/" + this.$route.query.id, {
        params: { seat_xid: this.$route.query.seat_xid }
      })
      .then(res => {
        // console.log(res);
        this.ticket = res.data;
      });
  },
  methods: {
    countPrice(value) {
      this.price = value;
    }
  }
};
</script>

<style lang="less" scoped>
.order {
  width: 1000px;
  margin: 20px auto;
  display: flex;
  .order_main {
    flex: 2;
  }
  .order_aside {
    flex: 1;
    padding-left: 20px;
  }
}
</style>