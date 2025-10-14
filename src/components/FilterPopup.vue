<template>
  <view class="filter-popup-container">
    <!-- 弹窗内容 -->
    <view v-if="visible" class="popup-content" :style="popupStyle">
      <!-- 视图模式切换 -->
      <view class="view-mode-section">
        <view
          class="mode-option"
          :class="{ active: viewMode === 'standard' }"
          @click="setViewMode('standard')"
        >
          <view class="mode-left">
            <text v-if="viewMode === 'standard'" class="check-icon">✓</text>
            <text v-else class="check-placeholder"></text>
            <text class="mode-text">Standard</text>
          </view>
        </view>
        <view
          class="mode-option"
          :class="{ active: viewMode === 'compact' }"
          @click="setViewMode('compact')"
        >
          <view class="mode-left">
            <text v-if="viewMode === 'compact'" class="check-icon">✓</text>
            <text v-else class="check-placeholder"></text>
            <text class="mode-text">Compact</text>
          </view>
        </view>
      </view>

      <!-- 筛选内容 -->
      <scroll-view class="filter-content" scroll-y>
        <!-- 筛选组 -->
        <view class="filter-group">
          <!-- Session Type -->
          <view class="filter-item" @click="toggleSection('sessionType')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Session Type</text>
            </view>
            <text class="item-icon">♠</text>
          </view>

          <!-- Bankroll -->
          <view class="filter-item" @click="toggleSection('bankroll')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Bankroll</text>
            </view>
            <text class="item-icon">💼</text>
          </view>

          <!-- Location -->
          <view class="filter-item" @click="toggleSection('location')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Location</text>
            </view>
            <text class="item-icon">⚓</text>
          </view>

          <!-- Game Type -->
          <view class="filter-item" @click="toggleSection('gameType')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Game Type</text>
            </view>
            <text class="item-icon">🎲</text>
          </view>

          <!-- Stakes -->
          <view class="filter-item" @click="toggleSection('stakes')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Stakes</text>
            </view>
            <text class="item-icon">💲</text>
          </view>

          <!-- Tags -->
          <view class="filter-item" @click="toggleSection('tags')">
            <view class="item-left">
              <text class="arrow-icon">></text>
              <text class="item-title">Tags</text>
            </view>
            <text class="item-icon">🏷</text>
          </view>
        </view>

        <!-- Date Range 组 -->
        <view class="filter-group date-range-group">
          <view class="filter-item" @click="toggleSection('dateRange')">
            <text class="item-title">Date Range</text>
            <text class="item-icon">📅</text>
          </view>
        </view>
      </scroll-view>

      <!-- Clear Filters Button -->
      <view class="clear-filters-section">
        <view class="clear-filters-btn" @click="resetFilters">
          <text class="clear-text">Clear Filters</text>
          <text class="clear-icon">Ⓧ</text>
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
  placement?: "bottom-right" | "bottom-left" | "auto"; // 定位策略
  gap?: number; // 与触发元素的间距
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  placement: "auto",
  gap: 12,
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
  viewModeChange: [mode: string];  // 添加视图模式变化事件
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
const viewMode = ref("standard");

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

  const { top, right, left, width, height } = props.triggerRect;
  const popupWidth = 300; // 弹窗宽度 (px)
  const verticalGap = props.gap; // 垂直间距，确保不遮挡触发元素
  const horizontalGap = 8; // 水平间距，确保不与触发元素重叠
  const edgeOffset = 16; // 边缘偏移，避免贴边

  // 计算垂直定位：触发元素底部 + 间距
  const topPosition = top + height + verticalGap;

  // 计算水平定位策略
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let positionStyle: any = {
    position: "fixed",
    top: `${topPosition}px`,
    width: `${popupWidth}px`,
    zIndex: 9999,
    transform: "translateY(0)",
    opacity: 1,
    animation: "popupSlideIn 0.3s ease-out",
  };

  // 根据 placement 属性决定定位策略
  if (props.placement === "auto") {
    // 智能定位：优先尝试右对齐，但要避免重叠
    const rightAlignLeft = right - popupWidth - horizontalGap;
    const leftAlignRight = left + width + horizontalGap;

    // 检查右对齐是否会超出左边界
    if (rightAlignLeft >= edgeOffset) {
      // 右对齐：弹窗右边缘对齐到触发元素左边缘左侧
      positionStyle.left = `${rightAlignLeft}px`;
    } else if (leftAlignRight + popupWidth <= screenWidth - edgeOffset) {
      // 左对齐：弹窗左边缘对齐到触发元素右边缘右侧
      positionStyle.left = `${leftAlignRight}px`;
    } else {
      // 都不适合，使用中心对齐到触发元素下方
      const centerAlign = left + width / 2 - popupWidth / 2;
      positionStyle.left = `${Math.max(
        edgeOffset,
        Math.min(centerAlign, screenWidth - popupWidth - edgeOffset)
      )}px`;
    }
  } else if (props.placement === "bottom-right") {
    // 强制右对齐：弹窗右边缘对齐到触发元素左边缘左侧
    positionStyle.left = `${right - popupWidth - horizontalGap}px`;
  } else if (props.placement === "bottom-left") {
    // 强制左对齐：弹窗左边缘对齐到触发元素右边缘右侧
    positionStyle.left = `${left + width + horizontalGap}px`;
  }

  // 边界检查：如果弹窗会超出屏幕底部，则向上显示
  const estimatedPopupHeight = 450; // 估计弹窗高度
  if (topPosition + estimatedPopupHeight > screenHeight - 20) {
    // 如果向下会超出屏幕，则向上显示
    positionStyle.top = `${top - verticalGap}px`;
    positionStyle.transform = "translateY(-100%)";
  }

  return positionStyle;
});

// 初始化数据
const initializeData = () => {
  availableGameTypes.value = SessionStorage.getAllGameTypes();
  availableLocations.value = SessionStorage.getAllLocations();
};

// 设置视图模式
const setViewMode = (mode: string) => {
  viewMode.value = mode;
  // 发出视图模式变化事件
  emit("viewModeChange", mode);
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
  z-index: 9999;
}

.popup-content {
  background: #eeeeee;
  border-radius: 20px;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 300px;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 视图模式切换
.view-mode-section {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 12px;
}

.mode-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
  height: 44px;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background: #ffffff;

    .mode-text {
      font-weight: 600;
      color: #000000;
    }
  }

  &:active {
    background: #f0f0f0;
  }
}

.mode-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.mode-text {
  font-size: 16px;
  color: #333333;
  font-weight: 400;
}

.check-icon {
  font-size: 16px;
  color: #000000;
  font-weight: bold;
  margin-right: 12px;
  width: 12px;
}

.check-placeholder {
  width: 12px;
  margin-right: 12px;
}

// 筛选内容
.filter-content {
  flex: 1;
  background: #ffffff;
}

// 筛选分组
.filter-group {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

// Date Range 单独分组，增加上方间距
.date-range-group {
  border-top: 2px solid #e9ecef;
  padding-top: 12px;
  margin-top: 12px;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  min-height: 44px;

  &:active {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-title {
  font-size: 16px;
  color: #000000;
  font-weight: 400;
}

.item-icon {
  font-size: 18px;
  color: #000000;
}

.arrow-icon {
  font-size: 16px;
  color: #666666;
  font-weight: bold;
  margin-right: 12px;
  width: 12px;
}

// Clear Filters 按钮
.clear-filters-section {
  border-top: 2px solid #e9ecef;
  background: #ffffff;
  margin-top: 12px;
}

.clear-filters-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  transition: background-color 0.2s ease;
  min-height: 44px;

  &:active {
    background: #f8f9fa;
  }
}

.clear-text {
  font-size: 16px;
  color: #000000;
  flex: 1;
  font-weight: 400;
}

.clear-icon {
  font-size: 18px;
  color: #666666;
  font-weight: bold;
}
</style>
