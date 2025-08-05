<template>
  <view class="all-sessions-page">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">All Sessions</text>
      <view class="header-icons">
        <view 
          class="icon-wrapper wallet-icon"
          :class="{ 'active': isWalletSelected }"
          @click="selectIcon('wallet')"
        >
          <image 
            :src="isWalletSelected ? '/src/static/icons/wallet-active.svg' : '/src/static/icons/wallet.svg'" 
            mode="aspectFit" 
            class="icon-image"
          />
        </view>
        <view 
          class="icon-wrapper settings-icon"
          :class="{ 'active': isSettingsSelected }"
          @click="selectIcon('settings')"
        >
          <image 
            :src="isSettingsSelected ? '/src/static/icons/settings-active.svg' : '/src/static/icons/settings.svg'" 
            mode="aspectFit" 
            class="icon-image"
          />
        </view>
        <uni-icons 
          :type="listType === 'impact' ? 'list' : 'grid'" 
          size="28" 
          class="icon-toggle"
          @click="toggleListType"
        />
      </view>
    </view>
    
    <!-- 主内容区：impact/standard 列表 -->
    <view class="session-list">
      <!-- impact 格式列表 -->
      <view v-if="listType === 'impact'" class="impact-list">
        <view 
          v-for="(session, index) in sessions" 
          :key="session.id || index"
          class="impact-item"
          @click="viewSessionDetail(session)"
        >
          <text class="impact-number">{{ index + 1 }}</text>
          <view class="impact-right">
            <text 
              class="impact-amount"
              :class="{ 'profit': getSessionProfit(session) >= 0, 'loss': getSessionProfit(session) < 0 }"
            >
              ${{ getSessionProfit(session) >= 0 ? '+' : '' }}{{ getSessionProfit(session) }}
            </text>
            <uni-icons type="right" size="16" class="impact-arrow" />
          </view>
        </view>
      </view>
      
      <!-- standard 格式列表 -->
      <view v-else class="standard-list">
        <view 
          v-for="(session, index) in sessions" 
          :key="session.id || index"
          class="standard-item"
          @click="viewSessionDetail(session)"
        >
          <view class="standard-left">
            <view class="session-icon">
              <text class="icon-text">♣</text>
            </view>
            <view class="session-info">
              <text class="session-number">{{ index + 1 }}</text>
              <text class="session-details">
                {{ formatSessionDetails(session) }}
              </text>
            </view>
          </view>
          <view class="standard-right">
            <text 
              class="standard-amount"
              :class="{ 'profit': getSessionProfit(session) >= 0, 'loss': getSessionProfit(session) < 0 }"
            >
              ${{ getSessionProfit(session) >= 0 ? '+' : '' }}{{ getSessionProfit(session) }}
            </text>
            <uni-icons type="right" size="16" class="standard-arrow" />
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部导航栏 -->
    <view class="tabbar">
      <uni-icons type="home" size="28" class="tabbar-icon" @click="navigateToHome" />
      <uni-icons type="list" size="28" class="tabbar-icon active" @click="navigateToAllSessions" />
      <uni-icons type="plusempty" size="36" class="tabbar-icon plus" @click="navigateToNewSession" />
      <uni-icons type="bar" size="28" class="tabbar-icon" @click="navigateToStats" />
      <uni-icons type="gear" size="28" class="tabbar-icon" @click="navigateToSettings" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SessionStorage } from '../../utils/storage'
import type { Session } from '../../types'
import SvgIcon from '../../components/SvgIcon.vue'

const sessions = ref<Session[]>([])
const listType = ref<'impact' | 'standard'>('standard')
const isWalletSelected = ref<boolean>(false)
const isSettingsSelected = ref<boolean>(false)

// 选择图标
const selectIcon = (icon: 'wallet' | 'settings') => {
  if (icon === 'wallet') {
    isWalletSelected.value = !isWalletSelected.value
  } else {
    isSettingsSelected.value = !isSettingsSelected.value
  }
}

// 切换列表格式
const toggleListType = () => {
  listType.value = listType.value === 'impact' ? 'standard' : 'impact'
}

// 获取会话盈亏
const getSessionProfit = (session: Session): number => {
  return session.cashOut - session.buyIn - (session.rebuys || 0) - (session.tableExpenses || 0)
}

// 格式化会话详情
const formatSessionDetails = (session: Session): string => {
  const date = new Date(session.startTime)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  
  return `${month}/${day}/${hour} · $${session.sessionType.stakes} · ${session.sessionType.game}`
}

// 查看会话详情
const viewSessionDetail = (session: Session) => {
  if (session.id) {
    uni.navigateTo({
      url: `/pages/session-detail/index?id=${session.id}`
    })
  } else {
    uni.showToast({
      title: '会话ID不存在',
      icon: 'error'
    })
  }
}

// 加载会话数据
const loadSessions = () => {
  sessions.value = SessionStorage.getAllSessions()
}

// 底部导航功能
const navigateToHome = () => {
  uni.navigateTo({
    url: '/pages/index/index'
  })
}

const navigateToAllSessions = () => {
  // 当前页面，无需跳转
}

const navigateToNewSession = () => {
  uni.navigateTo({
    url: '/pages/new-session/index'
  })
}

const navigateToStats = () => {
  uni.navigateTo({
    url: '/pages/stats/index'
  })
}

const navigateToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  })
}

onMounted(() => {
  loadSessions()
})
</script>

<style scoped lang="scss">
.all-sessions-page {
  background: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 32rpx 0 32rpx;
  background: #fafafa;
}

.title {
  font-size: 48rpx;
  font-weight: 800;
  font-family: 'Fredoka', 'Arial', sans-serif;
}

.header-icons {
  display: flex;
  gap: 24rpx;
}

.header-icons .icon-wrapper {
  width: 56rpx;
  height: 56rpx;
  margin-left: 24rpx;
  transition: all 0.3s ease;
}

.header-icons .wallet-icon {
  color: #7A7E83;
}

.header-icons .settings-icon {
  color: #7A7E83;
}

.header-icons .wallet-icon.active {
  color: #6c63ff;
}

.header-icons .settings-icon.active {
  color: #6c63ff;
}

.header-icons .icon-image {
  width: 100%;
  height: 100%;
}

.icon-toggle {
  margin-left: 24rpx;
  color: #6c63ff;
}

.session-list {
  flex: 1;
  padding: 0;
}

// impact 格式样式
.impact-list {
  padding: 0 32rpx;
}

.impact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.impact-number {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.impact-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.impact-amount {
  font-size: 32rpx;
  font-weight: 600;
}

.impact-amount.profit {
  color: #4caf50;
}

.impact-amount.loss {
  color: #f44336;
}

.impact-arrow {
  color: #999;
}

// standard 格式样式
.standard-list {
  padding: 0 32rpx;
}

.standard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.standard-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.session-icon {
  width: 48rpx;
  height: 48rpx;
  background: #6c63ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.session-number {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.session-details {
  font-size: 24rpx;
  color: #666;
}

.standard-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.standard-amount {
  font-size: 32rpx;
  font-weight: 600;
}

.standard-amount.profit {
  color: #4caf50;
}

.standard-amount.loss {
  color: #f44336;
}

.standard-arrow {
  color: #999;
}

.tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background: #fff;
  border-top: 1px solid #eee;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.tabbar-icon {
  color: #7c74b6;
  opacity: 0.5;
}

.tabbar-icon.active {
  color: #6c63ff;
  opacity: 1;
}

.tabbar-icon.plus {
  color: #6c63ff;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2rpx 8rpx rgba(108,99,255,0.15);
  margin-top: -24rpx;
}
</style>