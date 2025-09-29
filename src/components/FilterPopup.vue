<template>
  <view class="filter-popup-container">
    <!-- 遮罩层 -->
    <view v-if="visible" class="popup-mask" @click="closePopup"></view>

    <!-- 弹窗内容 -->
    <view v-if="visible" class="popup-content" :style="popupStyle">
      <!-- 视图模式切换 -->
      <view class="view-mode-section">
        <view
          class="mode-option"
          :class="{ active: viewMode === 'standard' }"
          @click="setViewMode('standard')"
        >
          <text class="mode-text">Standard</text>
        </view>
        <view
          class="mode-option"
          :class="{ active: viewMode === 'compact' }"
          @click="setViewMode('compact')"
        >
          <text class="mode-text">Compact</text>
          <text class="check-icon">✓</text>
        </view>
      </view>

      <!-- 筛选内容 -->
      <scroll-view class="filter-content" scroll-y>
        <!-- Session Type -->
        <view class="filter-item" @click="toggleSection('sessionType')">
          <text class="item-title">Session Type</text>
          <text class="item-icon">♣️</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Bankroll -->
        <view class="filter-item" @click="toggleSection('bankroll')">
          <text class="item-title">Bankroll</text>
          <text class="item-icon">💼</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Location -->
        <view class="filter-item" @click="toggleSection('location')">
          <text class="item-title">Location</text>
          <text class="item-icon">⚓</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Game Type -->
        <view class="filter-item" @click="toggleSection('gameType')">
          <text class="item-title">Game Type</text>
          <text class="item-icon">🎲</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Stakes -->
        <view class="filter-item" @click="toggleSection('stakes')">
          <text class="item-title">Stakes</text>
          <text class="item-icon">💰</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Tags -->
        <view class="filter-item" @click="toggleSection('tags')">
          <text class="item-title">Tags</text>
          <text class="item-icon">🏷️</text>
          <text class="arrow-icon">></text>
        </view>

        <!-- Date Range -->
        <view class="filter-item" @click="toggleSection('dateRange')">
          <text class="item-title">Date Range</text>
          <text class="item-icon">📅</text>
        </view>
      </scroll-view>

      <!-- Clear Filters Button -->
      <view class="clear-filters-section">
        <view class="clear-filters-btn" @click="resetFilters">
          <text class="clear-text">Clear Filters</text>
          <text class="clear-icon">✕</text>
        </view>
      </view>
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
  bankroll: [] as string[],
  stakes: [] as string[],
  tags: [] as string[],
  dateRange: {
    start: "",
    end: "",
  },
});

// 视图模式
const viewMode = ref("compact");

// 展开状态
const expandedSections = ref({
  sessionType: false,
  gameType: false,
  location: false,
  profitStatus: false,
  bankroll: false,
  stakes: false,
  tags: false,
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

// 设置视图模式
const setViewMode = (mode: string) => {
  viewMode.value = mode;
};

// 切换展开状态
const toggleSection = (section: string) => {
  // 这里可以添加导航到详细筛选页面的逻辑
  console.log("Toggle section:", section);
};

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    sessionType: "all",
    gameTypes: [],
    locations: [],
    profitStatus: "all",
    bankroll: [],
    stakes: [],
    tags: [],
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
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-width: 300px;
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

// 视图模式切换
.view-mode-section {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.mode-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background: #ffffff;

    .mode-text {
      font-weight: 500;
    }
  }

  &:active {
    background: #f0f0f0;
  }
}

.mode-text {
  font-size: 16px;
  color: #333333;
}

.check-icon {
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}

// 筛选内容
.filter-content {
  flex: 1;
  background: #ffffff;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;

  &:active {
    background: #f8f9fa;
  }
}

.item-title {
  font-size: 16px;
  color: #333333;
  flex: 1;
}

.item-icon {
  font-size: 18px;
  margin-right: 12px;
}

.arrow-icon {
  font-size: 16px;
  color: #999999;
  font-weight: bold;
}

// Clear Filters 按钮
.clear-filters-section {
  border-top: 1px solid #e9ecef;
  background: #ffffff;
}

.clear-filters-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  transition: background-color 0.2s ease;

  &:active {
    background: #f8f9fa;
  }
}

.clear-text {
  font-size: 16px;
  color: #333333;
  flex: 1;
}

.clear-icon {
  font-size: 18px;
  color: #999999;
  font-weight: bold;
}
</style>
