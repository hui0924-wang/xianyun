<template>
  <div class="flights_head">
    <div class="flights_head_item">航空信息</div>
    <div class="flights_head_item">起飞时间</div>
    <div class="flights_head_item">到达时间</div>
    <div class="flights_head_item">价格</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.flights_head {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 13px;
  color: #666;
  .flights_head_item {
    flex: 1;
  }
}
</style>