<template>
  <view class="filter-popup-container">
    <!-- 遮罩层 -->
    <view v-if="visible" class="popup-mask" @click="closePopup"></view>

    <!-- 弹窗内容 -->
    <view v-if="visible" class="popup-content" :style="popupStyle">
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">筛选条件</text>
        <view class="header-actions">
          <text class="reset-btn" @click="resetFilters">重置</text>
          <text class="close-btn" @click="closePopup">完成</text>
        </view>
      </view>

      <!-- 筛选内容 -->
      <scroll-view class="filter-content" scroll-y>
        <!-- 会话类型筛选 -->
        <view class="filter-section">
          <view class="section-header" @click="toggleSection('sessionType')">
            <text class="section-title">会话类型</text>
            <uni-icons
              :type="expandedSections.sessionType ? 'up' : 'down'"
              size="16"
              class="expand-icon"
            />
          </view>
          <view v-if="expandedSections.sessionType" class="section-content">
            <radio-group @change="onSessionTypeChange">
              <label class="filter-option">
                <radio value="all" :checked="filters.sessionType === 'all'" />
                <text class="option-text">全部</text>
              </label>
              <label class="filter-option">
                <radio
                  value="Cash Game"
                  :checked="filters.sessionType === 'Cash Game'"
                />
                <text class="option-text">现金游戏</text>
              </label>
              <label class="filter-option">
                <radio
                  value="Tournament"
                  :checked="filters.sessionType === 'Tournament'"
                />
                <text class="option-text">锦标赛</text>
              </label>
            </radio-group>
          </view>
        </view>

        <!-- 游戏类型筛选 -->
        <view class="filter-section">
          <view class="section-header" @click="toggleSection('gameType')">
            <text class="section-title">游戏类型</text>
            <uni-icons
              :type="expandedSections.gameType ? 'up' : 'down'"
              size="16"
              class="expand-icon"
            />
          </view>
          <view v-if="expandedSections.gameType" class="section-content">
            <checkbox-group @change="onGameTypeChange">
              <label
                v-for="gameType in availableGameTypes"
                :key="gameType"
                class="filter-option"
              >
                <checkbox
                  :value="gameType"
                  :checked="filters.gameTypes.includes(gameType)"
                />
                <text class="option-text">{{ gameType }}</text>
              </label>
            </checkbox-group>
          </view>
        </view>

        <!-- 位置筛选 -->
        <view class="filter-section">
          <view class="section-header" @click="toggleSection('location')">
            <text class="section-title">游戏位置</text>
            <uni-icons
              :type="expandedSections.location ? 'up' : 'down'"
              size="16"
              class="expand-icon"
            />
          </view>
          <view v-if="expandedSections.location" class="section-content">
            <checkbox-group @change="onLocationChange">
              <label
                v-for="location in availableLocations"
                :key="location"
                class="filter-option"
              >
                <checkbox
                  :value="location"
                  :checked="filters.locations.includes(location)"
                />
                <text class="option-text">{{ location }}</text>
              </label>
            </checkbox-group>
          </view>
        </view>

        <!-- 盈亏筛选 -->
        <view class="filter-section">
          <view class="section-header" @click="toggleSection('profitStatus')">
            <text class="section-title">盈亏状态</text>
            <uni-icons
              :type="expandedSections.profitStatus ? 'up' : 'down'"
              size="16"
              class="expand-icon"
            />
          </view>
          <view v-if="expandedSections.profitStatus" class="section-content">
            <radio-group @change="onProfitStatusChange">
              <label class="filter-option">
                <radio value="all" :checked="filters.profitStatus === 'all'" />
                <text class="option-text">全部</text>
              </label>
              <label class="filter-option">
                <radio
                  value="profit"
                  :checked="filters.profitStatus === 'profit'"
                />
                <text class="option-text">盈利</text>
              </label>
              <label class="filter-option">
                <radio
                  value="loss"
                  :checked="filters.profitStatus === 'loss'"
                />
                <text class="option-text">亏损</text>
              </label>
            </radio-group>
          </view>
        </view>

        <!-- 日期范围筛选 -->
        <view class="filter-section">
          <view class="section-header" @click="toggleSection('dateRange')">
            <text class="section-title">日期范围</text>
            <uni-icons
              :type="expandedSections.dateRange ? 'up' : 'down'"
              size="16"
              class="expand-icon"
            />
          </view>
          <view v-if="expandedSections.dateRange" class="section-content">
            <view class="date-range-section">
              <view class="date-input-group">
                <text class="date-label">开始日期:</text>
                <input
                  type="date"
                  class="date-input"
                  :value="filters.dateRange.start"
                  @input="onStartDateChange"
                  placeholder="选择开始日期"
                />
              </view>
              <view class="date-input-group">
                <text class="date-label">结束日期:</text>
                <input
                  type="date"
                  class="date-input"
                  :value="filters.dateRange.end"
                  @input="onEndDateChange"
                  placeholder="选择结束日期"
                />
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { SessionStorage } from "../utils/storage";

// Props
interface Props {
  visible: boolean;
  triggerRect?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  triggerRect: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  }),
});

// Emits
const emit = defineEmits<{
  close: [];
  filtersChange: [filters: any];
}>();

// 筛选条件
const filters = ref({
  sessionType: "all",
  gameTypes: [] as string[],
  locations: [] as string[],
  profitStatus: "all",
  dateRange: {
    start: "",
    end: "",
  },
});

// 展开状态
const expandedSections = ref({
  sessionType: true,
  gameType: false,
  location: false,
  profitStatus: false,
  dateRange: false,
});

// 可用选项
const availableGameTypes = ref<string[]>([]);
const availableLocations = ref<string[]>([]);

// 弹窗定位样式
const popupStyle = computed(() => {
  if (!props.triggerRect || !props.visible) return { display: "none" };

  const { top, right, width, height } = props.triggerRect;
  const popupWidth = 320; // 弹窗宽度 (px)
  const offsetTop = 8; // 距离触发元素的间距
  const offsetRight = 16; // 距离右边的间距

  // 计算定位，确保在触发元素的右下方
  const topPosition = top + height + offsetTop;
  const rightPosition = window.innerWidth - right + offsetRight;

  return {
    position: "fixed",
    top: `${topPosition}px`,
    right: `${rightPosition}px`,
    width: `${popupWidth}px`,
    zIndex: 1000,
    transform: "translateY(0)",
    opacity: 1,
    animation: "popupSlideIn 0.3s ease-out",
  };
});

// 初始化数据
const initializeData = () => {
  availableGameTypes.value = SessionStorage.getAllGameTypes();
  availableLocations.value = SessionStorage.getAllLocations();
};

// 切换展开状态
const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    sessionType: "all",
    gameTypes: [],
    locations: [],
    profitStatus: "all",
    dateRange: {
      start: "",
      end: "",
    },
  };
  emit("filtersChange", filters.value);
};

// 关闭弹窗
const closePopup = () => {
  emit("close");
};

// 筛选条件变化处理
const onSessionTypeChange = (e: any) => {
  filters.value.sessionType = e.detail.value;
  emit("filtersChange", filters.value);
};

const onGameTypeChange = (e: any) => {
  filters.value.gameTypes = e.detail.value;
  emit("filtersChange", filters.value);
};

const onLocationChange = (e: any) => {
  filters.value.locations = e.detail.value;
  emit("filtersChange", filters.value);
};

const onProfitStatusChange = (e: any) => {
  filters.value.profitStatus = e.detail.value;
  emit("filtersChange", filters.value);
};

const onStartDateChange = (e: any) => {
  filters.value.dateRange.start = e.detail ? e.detail.value : e.target.value;
  emit("filtersChange", filters.value);
};

const onEndDateChange = (e: any) => {
  filters.value.dateRange.end = e.detail ? e.detail.value : e.target.value;
  emit("filtersChange", filters.value);
};

// 监听 visible 变化，初始化数据
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      initializeData();
    }
  }
);
</script>

<style scoped lang="scss">
.filter-popup-container {
  position: relative;
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.popup-content {
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.12);
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 32rpx 24rpx 32rpx;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  border-radius: 16rpx 16rpx 0 0;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.header-actions {
  display: flex;
  gap: 32rpx;
}

.reset-btn,
.close-btn {
  font-size: 28rpx;
  color: #6c63ff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background: transparent;
  transition: all 0.2s ease;
}

.reset-btn:active,
.close-btn:active {
  background: rgba(108, 99, 255, 0.1);
  transform: scale(0.95);
}

.filter-content {
  flex: 1;
  height: 0;
}

.filter-section {
  border-bottom: 1px solid #f8f8f8;
}

.filter-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  background: #fafafa;
  transition: all 0.2s ease;
}

.section-header:active {
  background: #f0f0f0;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.expand-icon {
  color: #666666;
  transition: transform 0.2s ease;
}

.section-content {
  background: #ffffff;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1px solid #f8f8f8;
  transition: background-color 0.2s ease;
}

.filter-option:last-child {
  border-bottom: none;
}

.filter-option:active {
  background: #f8f8f8;
}

.option-text {
  margin-left: 24rpx;
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.date-range-section {
  padding: 24rpx 32rpx;
}

.date-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.date-input-group:last-child {
  margin-bottom: 0;
}

.date-label {
  font-size: 28rpx;
  color: #666666;
  width: 150rpx;
  margin-right: 24rpx;
}

.date-input {
  flex: 1;
  padding: 20rpx 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background: #ffffff;
  font-size: 28rpx;
  color: #333333;
  min-height: 44rpx;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.date-input:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 4rpx rgba(108, 99, 255, 0.1);
  outline: none;
}

/* radio 和 checkbox 样式优化 */
:deep(radio) {
  transform: scale(0.9);
  accent-color: #6c63ff;
}

:deep(checkbox) {
  transform: scale(0.9);
  accent-color: #6c63ff;
}

/* 滚动条样式 */
:deep(::-webkit-scrollbar) {
  width: 8rpx;
}

:deep(::-webkit-scrollbar-track) {
  background: #f8f8f8;
  border-radius: 4rpx;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #d0d0d0;
  border-radius: 4rpx;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #b0b0b0;
}
</style>
