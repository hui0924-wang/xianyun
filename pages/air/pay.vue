<template>
  <div class="pay">
    <div class="pay_view">
      <div class="pay_price">
        支付总金额 &nbsp;
        <span>￥{{order.price}}</span>
      </div>
      <div class="pay_content">
        <div class="pay_title">微信支付</div>
        <div class="pay_main">
          <div class="pay_code">
            <!-- 支付图片 -->
            <canvas id="canvas"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay_img">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var QRCode = require("qrcode");

export default {
  data() {
    return {
      order: {}
    };
  },
  mounted() {
    // 1 获取 订单的数据 价格 和 支付的图片（二维码。。。）
    // 请求带上token
    const token = this.$store.state.user.userinfo.token;
    this.$axios
      .get("/airorders/" + this.$route.query.id, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        // console.log(res);
        this.order = res.data;

        // 画出支付二维码
        var canvas = document.getElementById("canvas");
        // weixin://wxpay/bizpayurl?pr=j47lXhM
        QRCode.toCanvas(canvas, res.data.payInfo.code_url, function(error) {
          if (error) console.error(error);
          console.log("二维码转换成功");
        });

        // 定时发送请求，查询支付状态
        let timeId = setInterval(() => {
          this.$axios
            .post(
              "/airorders/checkpay",
              {
                id: this.$route.query.id,
                nonce_str: res.data.payInfo.nonce_str,
                out_trade_no: res.data.payInfo.order_no
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            )
            .then(res => {
              // console.log(res);
              if (res.data.trade_state === "SUCCESS") {
                // 支付完成  清除定时器
                clearInterval(timeId);
                this.$message.success(res.data.statusTxt);
              } else {
                console.log("false");
              }
            });
        }, 3000);
      });
  }
};
</script>

<style lang="less" scoped>
.pay {
  background-color: #f5f5f5;
  .pay_view {
    width: 1000px;
    // height: 690px;
    margin: 0 auto;
    .pay_price {
      padding: 10px 0;
      height: 70px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      > span {
        font-size: 28px;
        color: #f00;
      }
    }
    .pay_content {
      padding: 30px;
      background-color: #fff;
      border-top: 5px solid orange;
      .pay_title {
        font-size: 28px;
      }
      .pay_main {
        display: flex;
        padding: 0px 80px;
        justify-content: space-between;
        align-items: center;
        .pay_code {
          padding: 15px;
          border: 1px solid #ddd;
          text-align: center;
          #canvas {
            display: block;
            padding-bottom: 10px;
            height: 200px !important;
            width: 200px !important;
          }
          > p {
            font-size: 16px;
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>