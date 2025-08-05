<template>
  <view class="stats-page">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">Statistics</text>
      <view class="header-icons">
        <uni-icons type="calendar" size="28" class="icon-calendar" @click="showDatePicker" />
        <uni-icons type="filter" size="28" class="icon-filter" @click="showFilter" />
      </view>
    </view>

    <!-- 统计概览 -->
    <view class="stats-overview">
      <view class="stat-card">
        <text class="stat-label">Total Sessions</text>
        <text class="stat-value">{{ stats.totalSessions }}</text>
      </view>
      
      <view class="stat-card">
        <text class="stat-label">Total Profit</text>
        <text 
          class="stat-value"
          :class="{ 'profit': stats.totalProfit >= 0, 'loss': stats.totalProfit < 0 }"
        >
          ${{ stats.totalProfit >= 0 ? '+' : '' }}{{ stats.totalProfit }}
        </text>
      </view>
      
      <view class="stat-card">
        <text class="stat-label">Win Rate</text>
        <text class="stat-value">{{ Math.round(stats.winRate) }}%</text>
      </view>
      
      <view class="stat-card">
        <text class="stat-label">Avg Hourly</text>
        <text 
          class="stat-value"
          :class="{ 'profit': stats.averageHourlyProfit >= 0, 'loss': stats.averageHourlyProfit < 0 }"
        >
          ${{ stats.averageHourlyProfit >= 0 ? '+' : '' }}{{ Math.round(stats.averageHourlyProfit) }}
        </text>
      </view>
    </view>

    <!-- 图表区域 -->
    <view class="charts-section">
      <text class="section-title">Profit Trend</text>
      <view class="chart-container">
        <text class="chart-placeholder">图表功能待实现</text>
      </view>
    </view>

    <!-- 详细统计 -->
    <view class="detailed-stats">
      <text class="section-title">Detailed Statistics</text>
      
      <view class="stat-item">
        <text class="stat-name">Average Session Duration</text>
        <text class="stat-value">{{ formatDuration(stats.totalDuration) }}</text>
      </view>
      
      <view class="stat-item">
        <text class="stat-name">Average Profit per Session</text>
        <text 
          class="stat-value"
          :class="{ 'profit': stats.averageProfit >= 0, 'loss': stats.averageProfit < 0 }"
        >
          ${{ stats.averageProfit >= 0 ? '+' : '' }}{{ Math.round(stats.averageProfit) }}
        </text>
      </view>
      
      <view class="stat-item">
        <text class="stat-name">Best Session</text>
        <text class="stat-value">${{ stats.bestSession || 0 }}</text>
      </view>
      
      <view class="stat-item">
        <text class="stat-name">Worst Session</text>
        <text class="stat-value">${{ stats.worstSession || 0 }}</text>
      </view>
    </view>

    <!-- 游戏类型统计 -->
    <view class="game-stats">
      <text class="section-title">Game Type Breakdown</text>
      <view class="game-list">
        <view 
          v-for="game in gameStats" 
          :key="game.type"
          class="game-item"
        >
          <text class="game-type">{{ game.type }}</text>
          <view class="game-details">
            <text class="game-sessions">{{ game.sessions }} sessions</text>
            <text 
              class="game-profit"
              :class="{ 'profit': game.profit >= 0, 'loss': game.profit < 0 }"
            >
              ${{ game.profit >= 0 ? '+' : '' }}{{ game.profit }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SessionStorage } from '../../utils/storage'
import type { Session } from '../../types'

const stats = ref({
  totalSessions: 0,
  totalProfit: 0,
  winRate: 0,
  averageHourlyProfit: 0,
  totalDuration: 0,
  averageProfit: 0,
  bestSession: 0,
  worstSession: 0
})

const gameStats = ref<Array<{
  type: string
  sessions: number
  profit: number
}>>([])

// 计算统计数据
const calculateStats = () => {
  const sessions = SessionStorage.getAllSessions()
  const sessionStats = SessionStorage.getSessionStats()
  
  stats.value = {
    totalSessions: sessionStats.totalSessions,
    totalProfit: sessionStats.totalProfit,
    winRate: sessionStats.winRate,
    averageHourlyProfit: sessionStats.averageHourlyProfit,
    totalDuration: sessionStats.totalDuration,
    averageProfit: sessionStats.averageProfit,
    bestSession: 0,
    worstSession: 0
  }
  
  // 计算最佳和最差会话
  if (sessions.length > 0) {
    const profits = sessions.map(session => {
      return session.cashOut - session.buyIn - (session.rebuys || 0) - (session.tableExpenses || 0)
    })
    
    stats.value.bestSession = Math.max(...profits)
    stats.value.worstSession = Math.min(...profits)
  }
  
  // 计算游戏类型统计
  const gameMap = new Map<string, { sessions: number, profit: number }>()
  
  sessions.forEach(session => {
    const gameType = session.sessionType.game
    const profit = session.cashOut - session.buyIn - (session.rebuys || 0) - (session.tableExpenses || 0)
    
    if (gameMap.has(gameType)) {
      const existing = gameMap.get(gameType)!
      existing.sessions++
      existing.profit += profit
    } else {
      gameMap.set(gameType, { sessions: 1, profit })
    }
  })
  
  gameStats.value = Array.from(gameMap.entries()).map(([type, data]) => ({
    type,
    sessions: data.sessions,
    profit: data.profit
  }))
}

// 格式化时长
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// 显示日期选择器
const showDatePicker = () => {
  uni.showToast({
    title: '日期筛选功能待实现',
    icon: 'none'
  })
}

// 显示筛选器
const showFilter = () => {
  uni.showToast({
    title: '筛选功能待实现',
    icon: 'none'
  })
}

onMounted(() => {
  calculateStats()
})
</script>

<style scoped lang="scss">
.stats-page {
  background: #fafafa;
  min-height: 100vh;
  padding-bottom: 32rpx;
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

.icon-calendar, .icon-filter {
  color: #6c63ff;
}

.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  padding: 32rpx;
}

.stat-card {
  background: #fff;
  padding: 32rpx;
  border-radius: 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.stat-value.profit {
  color: #4caf50;
}

.stat-value.loss {
  color: #f44336;
}

.charts-section {
  background: #fff;
  margin: 24rpx 32rpx;
  padding: 32rpx;
  border-radius: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.chart-container {
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.chart-placeholder {
  color: #999;
  font-size: 28rpx;
}

.detailed-stats {
  background: #fff;
  margin: 24rpx 32rpx;
  padding: 32rpx;
  border-radius: 16rpx;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  font-size: 28rpx;
  color: #666;
}

.stat-name + .stat-value {
  font-size: 28rpx;
  font-weight: 600;
}

.game-stats {
  background: #fff;
  margin: 24rpx 32rpx;
  padding: 32rpx;
  border-radius: 16rpx;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.game-item:last-child {
  border-bottom: none;
}

.game-type {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.game-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.game-sessions {
  font-size: 24rpx;
  color: #666;
}

.game-profit {
  font-size: 28rpx;
  font-weight: 600;
}

.game-profit.profit {
  color: #4caf50;
}

.game-profit.loss {
  color: #f44336;
}
</style> 