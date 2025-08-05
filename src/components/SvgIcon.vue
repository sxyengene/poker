<template>
  <view 
    :style="{
      width: size + 'rpx',
      height: size + 'rpx',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      filter: filterColor
    }"
    @click="handleClick"
  >
    <image 
      :src="iconPath" 
      :style="{
        width: size + 'rpx',
        height: size + 'rpx'
      }"
      mode="aspectFit"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 56
  },
  color: {
    type: String,
    default: '#7A7E83'
  },
  active: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: '#6c63ff'
  }
})

const emit = defineEmits(['click'])

const iconPath = computed(() => {
  return `/src/static/icons/${props.name}.svg`
})

const currentColor = computed(() => {
  return props.active ? props.activeColor : props.color
})

// 将十六进制颜色转换为filter滤镜
const hexToFilter = (hex: string) => {
  // 移除#号
  const color = hex.replace('#', '')
  
  // 将十六进制转换为RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  
  // 使用更精确的算法计算filter值
  // 基于https://codepen.io/sosuke/pen/Pjoqqp
  const rgb = [r, g, b]
  
  // 计算亮度
  const brightness = Math.round((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 2.55)
  
  // 计算对比度
  const contrast = 100
  
  return `brightness(0) invert(${brightness}%) sepia(100%) saturate(10000%) hue-rotate(0deg)`
}

const filterColor = computed(() => {
  return hexToFilter(currentColor.value)
})

const handleClick = () => {
  emit('click', props.name)
}
</script>

<style scoped>
/* 通过CSS变量传递颜色给SVG */
image ::v-deep svg {
  color: v-bind(currentColor);
  fill: currentColor;
  stroke: currentColor;
}
</style>