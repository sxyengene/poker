<template>
  <view class="sub-filter-popup-container">
    <!-- 蒙层 -->
    <view 
      v-if="visible" 
      class="sub-popup-overlay" 
      @click="handleOverlayClick"
    ></view>
    
    <!-- 弹窗内容 -->
    <view v-if="visible" class="sub-popup-content" :style="popupStyle" @click.stop>
      <!-- 标题栏 -->
      <view class="sub-popup-header">
        <text class="header-title">{{ title }}</text>
        <view class="header-actions">
          <text class="close-btn" @click="closePopup">✕</text>
        </view>
      </view>
      
      <!-- 内容区域 -->
      <scroll-view class="sub-popup-body" scroll-y>
        <!-- 根据不同类型渲染不同的内容 -->
        <view v-if="type === 'single-select'">
          <radio-group @change="handleRadioChange">
            <label 
              v-for="(option, index) in options" 
              :key="index" 
              class="radio-item"
            >
              <radio 
                :value="option.value" 
                :checked="option.value === selectedValue"
                color="#007AFF"
              />
              <text class="option-text">{{ option.label }}</text>
            </label>
          </radio-group>
        </view>
        
        <view v-else-if="type === 'multi-select'">
          <checkbox-group @change="handleCheckboxChange">
            <label 
              v-for="(option, index) in options" 
              :key="index" 
              class="checkbox-item"
            >
              <checkbox 
                :value="option.value" 
                :checked="selectedValues.includes(option.value)"
                color="#007AFF"
              />
              <text class="option-text">{{ option.label }}</text>
            </label>
          </checkbox-group>
        </view>
        
        <view v-else-if="type === 'date-range'">
          <view class="date-input-group">
            <view class="date-input-item">
              <text class="date-label">Start Date</text>
              <input 
                class="date-input" 
                type="date" 
                :value="dateRange.start" 
                @change="handleStartDateChange"
              />
            </view>
            <view class="date-input-item">
              <text class="date-label">End Date</text>
              <input 
                class="date-input" 
                type="date" 
                :value="dateRange.end" 
                @change="handleEndDateChange"
              />
            </view>
          </view>
        </view>
      </scroll-view>
      
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";

// Props
interface Props {
  visible: boolean;
  title: string;
  type: 'single-select' | 'multi-select' | 'date-range';
  options: Array<{ label: string; value: string }>;
  initialValue: string | string[] | { start: string; end: string } | undefined;
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
  title: '',
  type: 'single-select',
  options: () => [],
  initialValue: undefined,
  triggerRect: undefined,
});

// Emits
const emit = defineEmits<{
  close: [];
  confirm: [value: any];
}>();

// 数据状态
const selectedValue = ref('');
const selectedValues = ref<string[]>([]);
const dateRange = ref({ start: '', end: '' });

// 弹窗定位样式
const popupStyle = computed(() => {
  // 即使不可见也计算位置，但将其移到屏幕外
  if (!props.triggerRect) {
    // 获取屏幕尺寸
    let screenWidth = 375;  // 默认值
    let screenHeight = 667; // 默认值
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
    
    return { 
      position: "fixed" as const,
      left: `${screenWidth + 100}px`, // 屏幕宽度+安全距离
      top: "0px",
      zIndex: 10000,
      maxHeight: "80vh",
    };
  }

  const { top, left, width, height } = props.triggerRect;
  const verticalGap = 8; // 垂直间距

  // 获取屏幕尺寸
  let screenWidth = 375;  // 默认值
  let screenHeight = 667; // 默认值
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

  // 计算基础定位
  let topPosition = top + height + verticalGap;
  let leftPosition = left + width; // 默认与按钮右侧对齐

  // 弹窗样式对象
  let positionStyle: any = {
    position: "fixed" as const,
    zIndex: 10000,
    transform: "translateY(0)",
    opacity: 1,
    maxHeight: "80vh",
  };

  // 获取真实的弹窗元素宽度用于边界检查
  let popupWidth = 200; // 默认宽度
  // 在微信小程序等非浏览器环境中，避免使用 document.querySelector 和 getBoundingClientRect
  // 因为这些 API 在微信小程序中不可用或行为不同

  // 边界检查：如果右侧空间不足则左对齐
  if (leftPosition + popupWidth > screenWidth) {
    leftPosition = left; // 左对齐
  }

  positionStyle.minWidth = `${Math.max(popupWidth, width)}px`;
  positionStyle.left = `${leftPosition}px`;
  positionStyle.top = `${topPosition}px`;

  // 如果不可见，将元素移到屏幕外右侧而不是使用display: none
  if (!props.visible) {
    positionStyle.left = `${screenWidth + 100}px`; // 屏幕宽度+安全距离
    positionStyle.top = "0px";
  }

  return positionStyle;
});

// 蒙层样式
const overlayStyle = computed(() => {
  // 获取屏幕尺寸
  let screenWidth = 375;  // 默认值
  try {
    // 使用 uni-app 提供的统一 API 获取屏幕信息，适用于所有平台
    const systemInfo = uni.getSystemInfoSync();
    screenWidth = systemInfo.screenWidth || 375;   // 备用默认值
  } catch (e) {
    // 获取失败时使用默认值
    screenWidth = 375;
  }
  
  return {
    position: "fixed" as const,
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "transparent",
    zIndex: 9999,
    // 当不可见时，将蒙层移到屏幕外
    ...(props.visible ? {} : { left: `${screenWidth + 100}px` }) // 屏幕宽度+安全距离
  };
});

// 初始化数据
const initializeData = () => {
  if (props.type === 'single-select' && typeof props.initialValue === 'string') {
    selectedValue.value = props.initialValue;
  } else if (props.type === 'multi-select' && Array.isArray(props.initialValue)) {
    selectedValues.value = [...props.initialValue];
  } else if (props.type === 'date-range' && typeof props.initialValue === 'object' && props.initialValue !== null) {
    dateRange.value = { ...props.initialValue } as { start: string; end: string };
  }
};

// 单选变化处理
const handleRadioChange = (e: any) => {
  selectedValue.value = e.detail.value;
  // 选择后直接确认并关闭弹窗
  emit("confirm", selectedValue.value);
  closePopup();
};

// 多选变化处理
const handleCheckboxChange = (e: any) => {
  selectedValues.value = e.detail.value;
  // 选择后直接确认并关闭弹窗
  emit("confirm", [...selectedValues.value]);
  closePopup();
};

// 日期变化处理
const handleStartDateChange = (e: any) => {
  dateRange.value.start = e.detail.value;
};

const handleEndDateChange = (e: any) => {
  dateRange.value.end = e.detail.value;
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
      // 使用 nextTick 确保 DOM 更新后再初始化数据
      nextTick(() => {
        initializeData();
      });
    }
  }
);
</script>

<style scoped lang="scss">
.sub-filter-popup-container {
  position: relative;
  z-index: 10000;
}

// 蒙层样式
.sub-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9999;
}

.sub-popup-content {
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 300px;
  border: 1px solid #e0e0e0;
  opacity: 1;
  animation: popupSlideIn 0.3s ease-out;
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

// 标题栏
.sub-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}

.close-btn {
  font-size: 24px;
  color: #666666;
  padding: 4px;
}

// 内容区域
.sub-popup-body {
  flex: 1;
  background: #ffffff;
}

.radio-item, .checkbox-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  min-height: 44px;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8f9fa;
  }
}

.option-text {
  font-size: 16px;
  color: #000000;
  font-weight: 400;
  flex: 1;
}

// 日期范围样式
.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 24px;
}

.date-input-item {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 6px;
}

.date-input {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}
</style>