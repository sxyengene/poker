<template>
  <view class="filter-popup-container">
    <!-- 蒙层 -->
    <view 
      v-if="visible" 
      class="popup-overlay" 
      @click="handleOverlayClick"
    ></view>
    
    <!-- 弹窗内容 -->
    <view v-if="visible" class="popup-content" :style="popupStyle" @click.stop>
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
          <view class="filter-item" id="filter-session-type" @click="toggleSection('sessionType', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Session Type</text>
            </view>
            <text class="item-icon">♠</text>
          </view>

          <!-- Bankroll -->
          <view class="filter-item" id="filter-bankroll" @click="toggleSection('bankroll', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Bankroll</text>
            </view>
            <text class="item-icon">💼</text>
          </view>

          <!-- Location -->
          <view class="filter-item" id="filter-location" @click="toggleSection('location', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Location</text>
            </view>
            <text class="item-icon">⚓</text>
          </view>

          <!-- Game Type -->
          <view class="filter-item" id="filter-game-type" @click="toggleSection('gameType', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Game Type</text>
            </view>
            <text class="item-icon">🎲</text>
          </view>

          <!-- Stakes -->
          <view class="filter-item" id="filter-stakes" @click="toggleSection('stakes', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Stakes</text>
            </view>
            <text class="item-icon">💲</text>
          </view>

          <!-- Tags -->
          <view class="filter-item" id="filter-tags" @click="toggleSection('tags', $event)">
            <view class="item-left">
              <text class="arrow-icon">›</text>
              <text class="item-title">Tags</text>
            </view>
            <text class="item-icon">🏷</text>
          </view>
        </view>

        <!-- Date Range 组 -->
        <view class="filter-group date-range-group">
          <view class="filter-item" id="filter-date-range" @click="toggleSection('dateRange', $event)">
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
    
    <!-- 二级筛选弹窗 -->
    <SubFilterPopup
      :visible="subPopupVisible"
      :title="subPopupTitle"
      :type="subPopupType"
      :options="subPopupOptions"
      :initial-value="subPopupInitialValue"
      :trigger-rect="subPopupTriggerRect"
      @close="closeSubPopup"
      @confirm="handleSubPopupConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, nextTick } from "vue";
import { SessionStorage } from "../utils/storage";
import SubFilterPopup from "./SubFilterPopup.vue";

// 获取当前实例
const instance = getCurrentInstance();

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

// 二级弹窗相关状态
const subPopupVisible = ref(false);
const subPopupTitle = ref("");
const subPopupType = ref<"single-select" | "multi-select" | "date-range">("single-select");
const subPopupOptions = ref<Array<{ label: string; value: string }>>([]);
const subPopupInitialValue = ref<string | string[] | { start: string; end: string }>();
const subPopupTriggerRect = ref({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
});
const currentSection = ref(""); // 当前正在操作的筛选项

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
  let screenWidth, screenHeight;
  try {
    // 使用 uni-app 提供的统一 API 获取屏幕信息，适用于所有平台
    const systemInfo = uni.getSystemInfoSync();
    screenWidth = systemInfo.screenWidth || 375;   // 备用默认值
    screenHeight = systemInfo.screenHeight || 667;  // 备用默认值
  } catch (e) {
    // 获取失败时使用默认值
    screenWidth = 375;
    screenHeight = 667;
  }

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
  
  // 从本地存储恢复视图模式
  const savedViewMode = SessionStorage.getViewMode();
  viewMode.value = savedViewMode;
};

// 设置视图模式
const setViewMode = (mode: string) => {
  viewMode.value = mode;
  // 发出视图模式变化事件
  emit("viewModeChange", mode);
  // 保存视图模式到本地存储
  SessionStorage.saveViewMode(mode as "compact" | "standard");
};

// 切换展开状态
const toggleSection = (section: string, event: Event) => {
  // 记录当前操作的筛选项
  currentSection.value = section;
  console.log('%c 123123', 'color: green;',section);
  
  // 根据不同的筛选项确定对应元素的 ID
  let elementId = '';
  switch (section) {
    case 'sessionType':
      elementId = '#filter-session-type';
      break;
    case 'bankroll':
      elementId = '#filter-bankroll';
      break;
    case 'location':
      elementId = '#filter-location';
      break;
    case 'gameType':
      elementId = '#filter-game-type';
      break;
    case 'stakes':
      elementId = '#filter-stakes';
      break;
    case 'tags':
      elementId = '#filter-tags';
      break;
    case 'dateRange':
      elementId = '#filter-date-range';
      break;
    default:
      return;
  }
  
  // 获取触发元素的位置信息
  // 使用 nextTick 确保 DOM 更新完成后再查询元素位置
  nextTick(() => {
    // 使用 uni-app 提供的统一 API 替代 getBoundingClientRect
    const query = uni.createSelectorQuery().in(instance);
    query.selectViewport().boundingClientRect();
    query.select(elementId).boundingClientRect((rects) => {
      // 处理可能返回数组的情况
      console.log('%c 222', 'color: green;',elementId,rects);
      
      // 在某些情况下 rects 可能为 null，需要添加容错处理
      if (!rects) {
        console.warn(`Element ${elementId} not found or not visible`);
        // 使用默认位置或触发元素位置
        subPopupTriggerRect.value = { ...props.triggerRect };
        setupSubPopup(section);
        subPopupVisible.value = true;
        return;
      }
      
      const rect = Array.isArray(rects) ? rects[0] : rects;
      console.log('%c rect', 'color: green;',rect);
      if (rect) {
        console.log('%c 333', 'color: green;',333);
        subPopupTriggerRect.value = {
          top: rect.top || 0,
          right: rect.right || 0,
          bottom: rect.bottom || 0,
          left: rect.left || 0,
          width: rect.width || 0,
          height: rect.height || 0
        };
        
        setupSubPopup(section);
        // 显示二级弹窗
        subPopupVisible.value = true;
      } else {
        // rect 为空时使用默认位置
        console.warn(`Element ${elementId} bounding rect is empty`);
        subPopupTriggerRect.value = { ...props.triggerRect };
        setupSubPopup(section);
        subPopupVisible.value = true;
      }
    }).exec();
  });
};

// 设置二级弹窗内容
const setupSubPopup = (section: string) => {
  // 根据不同的筛选项设置不同的弹窗内容
  switch (section) {
    case "sessionType":
      subPopupTitle.value = "Session Type";
      subPopupType.value = "single-select";
      subPopupOptions.value = [
        { label: "All", value: "all" },
        { label: "Cash Game", value: "Cash Game" },
        { label: "Tournament", value: "Tournament" },
        { label: "Sit & Go", value: "Sit & Go" }
      ];
      subPopupInitialValue.value = filters.value.sessionType;
      break;
      
    case "bankroll":
      subPopupTitle.value = "Bankroll";
      subPopupType.value = "multi-select";
      subPopupOptions.value = [
        { label: "$50", value: "50" },
        { label: "$100", value: "100" },
        { label: "$200", value: "200" },
        { label: "$500", value: "500" },
        { label: "$1000", value: "1000" }
      ];
      subPopupInitialValue.value = [...filters.value.bankroll];
      break;
      
    case "location":
      subPopupTitle.value = "Location";
      subPopupType.value = "multi-select";
      subPopupOptions.value = availableLocations.value.map(location => ({
        label: location,
        value: location
      }));
      subPopupInitialValue.value = [...filters.value.locations];
      break;
      
    case "gameType":
      subPopupTitle.value = "Game Type";
      subPopupType.value = "multi-select";
      subPopupOptions.value = availableGameTypes.value.map(type => ({
        label: type,
        value: type
      }));
      subPopupInitialValue.value = [...filters.value.gameTypes];
      break;
      
    case "stakes":
      subPopupTitle.value = "Stakes";
      subPopupType.value = "multi-select";
      subPopupOptions.value = [
        { label: "$0.01/$0.02", value: "0.01/0.02" },
        { label: "$0.02/$0.05", value: "0.02/0.05" },
        { label: "$0.05/$0.10", value: "0.05/0.10" },
        { label: "$0.10/$0.25", value: "0.10/0.25" },
        { label: "$0.25/$0.50", value: "0.25/0.50" },
        { label: "$0.50/$1", value: "0.50/1" },
        { label: "$1/$2", value: "1/2" },
        { label: "$2/$5", value: "2/5" },
        { label: "$5/$10", value: "5/10" }
      ];
      subPopupInitialValue.value = [...filters.value.stakes];
      break;
      
    case "tags":
      subPopupTitle.value = "Tags";
      subPopupType.value = "multi-select";
      subPopupOptions.value = [
        { label: "Online", value: "online" },
        { label: "Live", value: "live" },
        { label: "Home Game", value: "home" },
        { label: "Casino", value: "casino" },
        { label: "Vacation", value: "vacation" }
      ];
      subPopupInitialValue.value = [...filters.value.tags];
      break;
      
    case "dateRange":
      subPopupTitle.value = "Date Range";
      subPopupType.value = "date-range";
      subPopupInitialValue.value = { ...filters.value.dateRange };
      break;
      
    default:
      return;
  }
};

// 关闭二级弹窗
const closeSubPopup = () => {
  subPopupVisible.value = false;
};

// 处理二级弹窗确认
const handleSubPopupConfirm = (value: any) => {
  // 根据当前操作的筛选项更新对应的筛选条件
  switch (currentSection.value) {
    case "sessionType":
      filters.value.sessionType = value as string;
      break;
      
    case "bankroll":
      filters.value.bankroll = value as string[];
      break;
      
    case "location":
      filters.value.locations = value as string[];
      break;
      
    case "gameType":
      filters.value.gameTypes = value as string[];
      break;
      
    case "stakes":
      filters.value.stakes = value as string[];
      break;
      
    case "tags":
      filters.value.tags = value as string[];
      break;
      
    case "dateRange":
      filters.value.dateRange = value as { start: string; end: string };
      break;
  }
  
  // 发出筛选条件变化事件
  emit("filtersChange", filters.value);
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

// 处理蒙层点击
const handleOverlayClick = () => {
  closePopup();
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

// 蒙层样式
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9998;
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