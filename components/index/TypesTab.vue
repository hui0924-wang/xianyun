<template>
  <div class="types_tab">
    <div class="types_tab_title">
      <div
        class="title_item"
        @click="titleChange(index)"
        :class="index===currentIndex? 'active':''"
        v-for="(item,index) in titles"
        :key="index"
      >{{item.text}}</div>
    </div>
    <div class="types_tab_content">
      <input type="text" :placeholder="titles[currentIndex].ph" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titles: [
        { text: "攻略", ph: "请输入攻略" },
        { text: "酒店", ph: "请输入酒店" },
        { text: "机票", ph: "请输入机票" }
      ],
      currentIndex: 0
    };
  },
  methods: {
    titleChange(index) {
      this.currentIndex = index;
      if (index === 2) {
        this.$router.push("/air");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.types_tab {
  width: 550px;
  .types_tab_title {
    height: 40px;
    display: flex;
    .title_item {
      width: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      margin-left: 10px;
      transform: skew(10deg);
      &:hover {
        cursor: pointer;
      }
    }
    .active {
      color: #000;
      background-color: #eee;
    }
  }
  .types_tab_content {
    height: 50px;
    input {
      display: block;
      width: 100%;
      height: 100%;
      background: #fff;
      border: none;
      outline: none;
      font-size: 16px;
      text-indent: 15px;
      border-radius: 5px;
      border-top-left-radius: 0px;
    }
  }
}
</style>