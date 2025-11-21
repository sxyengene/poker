<template>
  <view class="example-page">
    <view class="header">
      <text class="title">Filter Popup 示例</text>
    </view>
    
    <view class="content">
      <button class="show-filter-btn" @click="showFilter">显示筛选弹窗</button>
      
      <!-- 筛选弹窗 -->
      <FilterPopup
        :visible="showFilterPopup"
        :trigger-rect="filterIconRect"
        @close="closeFilterPopup"
        @filters-change="onFiltersChange"
        @view-mode-change="onViewModeChange"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FilterPopup from "../../components/FilterPopup.vue";

const showFilterPopup = ref(false);
const filterIconRect = ref({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
});

// 显示筛选弹窗
const showFilter = () => {
  // 模拟触发元素的位置（在实际应用中，这应该是筛选图标的实际位置）
  filterIconRect.value = {
    top: 100,
    right: 300,
    bottom: 150,
    left: 250,
    width: 50,
    height: 50,
  };
  showFilterPopup.value = true;
};

// 关闭筛选弹窗
const closeFilterPopup = () => {
  showFilterPopup.value = false;
};

// 处理筛选条件变化
const onFiltersChange = (filters: any) => {
  console.log("筛选条件变化:", filters);
};

// 处理视图模式变化
const onViewModeChange = (mode: string) => {
  console.log("视图模式变化:", mode);
};
</script>

<style scoped lang="scss">
.example-page {
  background: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx;
  background: #fafafa;
}

.title {
  font-size: 48rpx;
  font-weight: 800;
  font-family: "Fredoka", "Arial", sans-serif;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.show-filter-btn {
  padding: 24rpx 48rpx;
  background: #6c63ff;
  color: white;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(108, 99, 255, 0.3);
}
</style>
