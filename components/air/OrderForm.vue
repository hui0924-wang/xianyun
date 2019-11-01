<template>
  <div>
    <div class="fly_people">
      <!-- 乘机人 -->
      <input type="hidden" name="price" :value="price" />
      <div class="fly_people_title">乘机人</div>
      <div class="fly_people_content">
        <el-form ref="form" label-width="80px" label-position="top">
          <div class="user_item" v-for="(item,index) in users" :key="index">
            <el-form-item label="乘机人类型">
              <el-row>
                <el-col :span="6">
                  <el-select placeholder value="成人">
                    <el-option label="成人" value="成人"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <el-input v-model="item.username" placeholder="姓名"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- 当索引不等于0 时 展示 -->
            <div class="decrement" @click="handleDecrement(index)" v-if="index!== 0">-</div>
            <el-form-item label="证件类型">
              <el-row>
                <el-col :span="6">
                  <el-select placeholder value="身份证">
                    <el-option label="身份证" value="身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <el-input v-model="item.id" placeholder="证件号码"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="handleAddUser">添加乘机人</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 保险 -->
    <div class="insurance">
      <div class="insurance_title">保险</div>
      <div class="insurance_content">
        <div class="insurance_row" v-for="(item) in ticket.insurances" :key="item.id">
          <el-checkbox
            label="备选项1"
            border
            size="medium"
            @change="handleInsuranceChange(item.id)"
          >{{item.type}}：￥{{item.price}}/份×1最高赔付{{item.compensation}}</el-checkbox>
        </div>
      </div>
    </div>
    <!-- 联系人 -->
    <div class="contact">
      <div class="contact_title">联系人</div>
      <div class="contact_content">
        <el-form ref="form" label-width="60px">
          <el-form-item label="姓名" style="width:50%">
            <el-input v-model="contactName"></el-input>
          </el-form-item>
          <el-form-item label="手机" style="width:50%">
            <el-input v-model="contactPhone">
              <template slot="append">
                <div @click="sendCaptcha">发送验证码</div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" style="width:50%">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="warning" @click="sumitOrder">提交订单</el-button>
          </el-form-item>
        </el-form>
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
    }
  },
  data() {
    return {
      // 乘机人
      users: [{ username: "花花", id: "12345599" }],
      //保险id
      insurances: [],
      // 联系人名字
      contactName: "花花",
      // 联系人电话
      contactPhone: "18818249300",
      // 是否需要发票
      invoice: false,
      // 座位id
      seat_xid: this.$route.query.seat_xid,
      // 航班id
      air: this.$route.query.id,
      captcha: "000000"
    };
  },
  methods: {
    // 添加乘机人
    handleAddUser() {
      this.users.push({ username: "", id: "" });
    },
    // 减少乘机人
    handleDecrement(index) {
      this.users.splice(index, 1);
    },
    // 保险 复选框选中事件
    handleInsuranceChange(id) {
      // 判断点击后是选择，还是取消选择
      const index = this.insurances.findIndex(v => v === id);
      if (index === -1) {
        // 没有添加过,选择，添加id
        this.insurances.push(id);
      } else {
        // 添加过,取消选择，删除id
        this.insurances.splice(index, 1);
      }
    },
    // 发送验证码
    sendCaptcha() {
      // 获取用户的手机号码
      let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (reg.test(this.contactPhone)) {
        this.$axios.post("/captchas", { tel: this.contactPhone }).then(res => {
          console.log(res);
        });
      } else {
        this.$message.warning("手机号码不合法");
      }
    },
    sumitOrder() {
      let form = {
        // 乘机人
        // users: this.users,
        //保险id
        // insurances: this.insurances,
        // 联系人名字
        contactName: this.contactName,
        // 联系人电话
        contactPhone: this.contactPhone,
        // 是否需要发票
        invoice: this.invoice,
        // 座位id
        seat_xid: this.seat_xid,
        // 航班id
        air: this.air,
        // 验证码
        captcha: this.captcha
      };
      // 对form 进行验证
      // ！！！ insurances不用验证 users 单独验证

      //1. 对乘机人 做验证
      let isUserOk = true;
      this.users.forEach(v => {
        if (v.username === "" || v.id === "") {
          //不合法
          // break 跳出循环  forEach方法不能用break 跳出循环,可以用return false
          isUserOk = false;
          // return false;
        }
      });
      if (!isUserOk) {
        this.$message.warning("联系人输入不合法");
        return;
      }
      //2. 对 form 做验证 用对象遍历的方法
      let isFormOk = true;
      for (const key in form) {
        // 这里因为invoice是Boolean(默认为false),所以不能用if(!form[key])，否则会进入报错
        if (form[key] === "") {
          isFormOk = false;
          break;
        }
      }
      if (!isFormOk) {
        this.$message.warning("输入不合法");
        return;
      }

      // 3.把users insurances 加回表单
      form.users = this.users;
      form.insurances = this.insurances;

      // 提交机票订单
      // 获取vuex 中的 token
      const token = this.$store.state.user.userinfo.token;
      // 模拟token 失效
      // const token = "";

      this.$axios
        .post("/airorders", form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          console.log(res);
          this.$message.success({ message: res.data.message, duration: 1000 });
          this.$router.push({
            path: "/air/pay",
            query: { id: res.data.data.id }
          });
        });
    }
  },
  computed: {
    price() {
      let price = 0;
      // 机票费用
      price += this.ticket.base_price;
      // 机建/燃油费用
      price += this.ticket.airport_tax_audlet;
      // 保险费用
      // 通过保险id 获得保险对象 再获得价格
      //  this.insurances=[1,2]
      // 要拿1,2 id 去ticket.insurances里获得价格
      this.insurances.forEach(v => {
        const index = this.ticket.insurances.findIndex(vv => vv.id === v);
        // 获取保险对象
        const item = this.ticket.insurances[index];
        // 价格叠加
        price += item.price;
      });
      // *乘机人数 得出总价
      price *= this.users.length;
      // 发射事件给父组件 传递价格
      this.$emit("countPrice", price);
      return price;
    }
  }
};
</script>

<style lang="less" scoped>
.fly_people_title,
.insurance_title,
.contact_title {
  font-size: 22px;
  margin-bottom: 20px;
}
.fly_people_content {
  padding-bottom: 20px 0;
  border-bottom: 1px dotted rgb(161, 160, 160);
  .user_item {
    padding: 0 0 20px;
    border-bottom: 1px dashed #ccc;
    position: relative;
    .decrement {
      position: absolute;
      right: -20px;
      top: 105px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #ddd;
      text-align: center;
      line-height: 16px;
      color: #fff;
      cursor: pointer;
    }
  }
  .el-form-item {
    margin: 0;
  }
  .el-button {
    margin: 20px 0;
  }
}
.insurance {
  padding: 20px 0;
  border-bottom: 1px dotted #ccc;
}
.insurance_row {
  margin: 20px 0;
}
.contact {
  margin: 20px 0;
  .submit {
    display: block;
    margin: 50px auto;
    text-align: center;
    .el-button {
      width: 250px;
      height: 50px;
      padding: 12px 20px;
      margin-left: -30px;
    }
  }
}
</style>