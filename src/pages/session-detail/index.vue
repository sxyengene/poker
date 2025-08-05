<template>
  <view class="session-detail-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="28" class="back-icon" @click="goBack" />
      <text class="title">Session Detail</text>
      <uni-icons type="more" size="28" class="more-icon" @click="showOptions" />
    </view>

    <!-- 会话基本信息 -->
    <view class="session-info">
      <view class="session-header">
        <view class="session-icon">
          <text class="icon-text">♣</text>
        </view>
        <view class="session-title">
          <text class="session-type">{{ session?.sessionType?.session }}</text>
          <text class="session-location">{{ session?.sessionType?.location }}</text>
        </view>
      </view>
      
      <view class="profit-section">
        <text class="profit-label">Total Profit</text>
        <text 
          class="profit-amount"
          :class="{ 'profit': getSessionProfit() >= 0, 'loss': getSessionProfit() < 0 }"
        >
          ${{ getSessionProfit() >= 0 ? '+' : '' }}{{ getSessionProfit() }}
        </text>
      </view>
    </view>

    <!-- 财务详情 -->
    <view class="financial-details">
      <text class="section-title">Financial Details</text>
      
      <view class="detail-item">
        <text class="detail-label">Buy In</text>
        <text class="detail-value">${{ session?.buyIn || 0 }}</text>
      </view>
      
      <view class="detail-item">
        <text class="detail-label">Cash Out</text>
        <text class="detail-value">${{ session?.cashOut || 0 }}</text>
      </view>
      
      <view class="detail-item" v-if="session?.rebuys">
        <text class="detail-label">Rebuys</text>
        <text class="detail-value">${{ session.rebuys }}</text>
      </view>
      
      <view class="detail-item" v-if="session?.tableExpenses">
        <text class="detail-label">Table Expenses</text>
        <text class="detail-value">${{ session.tableExpenses }}</text>
      </view>
    </view>

    <!-- 游戏信息 -->
    <view class="game-details">
      <text class="section-title">Game Information</text>
      
      <view class="detail-item">
        <text class="detail-label">Game Type</text>
        <text class="detail-value">{{ session?.sessionType?.game }}</text>
      </view>
      
      <view class="detail-item">
        <text class="detail-label">Stakes</text>
        <text class="detail-value">${{ session?.sessionType?.stakes }}</text>
      </view>
    </view>

    <!-- 时间信息 -->
    <view class="time-details">
      <text class="section-title">Time Information</text>
      
      <view class="detail-item">
        <text class="detail-label">Start Time</text>
        <text class="detail-value">{{ formatDateTime(session?.startTime) }}</text>
      </view>
      
      <view class="detail-item">
        <text class="detail-label">End Time</text>
        <text class="detail-value">{{ formatDateTime(session?.endTime) }}</text>
      </view>
      
      <view class="detail-item">
        <text class="detail-label">Duration</text>
        <text class="detail-value">{{ getSessionDuration() }}</text>
      </view>
    </view>

    <!-- 备注信息 -->
    <view class="notes-section" v-if="session?.notes">
      <text class="section-title">Notes</text>
      <text class="notes-text">{{ session.notes }}</text>
    </view>

    <!-- 标签信息 -->
    <view class="tags-section" v-if="session?.tags && session.tags.length > 0">
      <text class="section-title">Tags</text>
      <view class="tags-container">
        <text 
          v-for="tag in session.tags" 
          :key="tag"
          class="tag-item"
        >
          {{ tag }}
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="edit-btn" @click="editSession">Edit Session</button>
      <button class="delete-btn" @click="deleteSession">Delete Session</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SessionStorage } from '../../utils/storage'
import type { Session } from '../../types'

const session = ref<Session | null>(null)
const sessionId = ref<string>('')

// 获取路由参数
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options.id) {
    sessionId.value = options.id
    loadSessionDetail()
  }
})

// 加载会话详情
const loadSessionDetail = () => {
  if (sessionId.value) {
    const sessionData = SessionStorage.getSessionById(sessionId.value)
    if (sessionData) {
      session.value = sessionData
    } else {
      uni.showToast({
        title: '会话不存在',
        icon: 'error'
      })
      goBack()
    }
  }
}

// 获取会话盈亏
const getSessionProfit = (): number => {
  if (!session.value) return 0
  return session.value.cashOut - session.value.buyIn - (session.value.rebuys || 0) - (session.value.tableExpenses || 0)
}

// 格式化日期时间
const formatDateTime = (date: Date | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取会话时长
const getSessionDuration = (): string => {
  if (!session.value?.startTime || !session.value?.endTime) return 'N/A'
  
  const start = new Date(session.value.startTime)
  const end = new Date(session.value.endTime)
  const diff = end.getTime() - start.getTime()
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 显示更多选项
const showOptions = () => {
  uni.showActionSheet({
    itemList: ['Edit', 'Delete', 'Share'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          editSession()
          break
        case 1:
          deleteSession()
          break
        case 2:
          shareSession()
          break
      }
    }
  })
}

// 编辑会话
const editSession = () => {
  uni.navigateTo({
    url: `/pages/new-session/index?id=${sessionId.value}`
  })
}

// 删除会话
const deleteSession = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个会话吗？此操作不可撤销。',
    success: (res) => {
      if (res.confirm) {
        if (SessionStorage.deleteSession(sessionId.value)) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          goBack()
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'error'
          })
        }
      }
    }
  })
}

// 分享会话
const shareSession = () => {
  uni.showToast({
    title: '分享功能待实现',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.session-detail-page {
  background: #fafafa;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.back-icon, .more-icon {
  color: #6c63ff;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.session-info {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.session-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.session-icon {
  width: 64rpx;
  height: 64rpx;
  background: #6c63ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
}

.session-title {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.session-type {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.session-location {
  font-size: 24rpx;
  color: #666;
}

.profit-section {
  text-align: center;
}

.profit-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.profit-amount {
  font-size: 48rpx;
  font-weight: 800;
}

.profit-amount.profit {
  color: #4caf50;
}

.profit-amount.loss {
  color: #f44336;
}

.financial-details,
.game-details,
.time-details,
.notes-section,
.tags-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.notes-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  background: #6c63ff;
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx 32rpx;
  border-top: 1px solid #eee;
  display: flex;
  gap: 24rpx;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 500;
}

.edit-btn {
  background: #6c63ff;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}
</style> 