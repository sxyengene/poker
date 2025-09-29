<template>
  <view class="settings-page">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">Settings</text>
    </view>

    <!-- 设置选项 -->
    <view class="settings-list">
      <!-- 数据管理 -->
      <view class="settings-section">
        <text class="section-title">Data Management</text>
        
        <view class="setting-item" @click="exportData">
          <view class="setting-left">
            <uni-icons type="download" size="24" class="setting-icon" />
            <text class="setting-label">Export Data</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
        
        <view class="setting-item" @click="importData">
          <view class="setting-left">
            <uni-icons type="upload" size="24" class="setting-icon" />
            <text class="setting-label">Import Data</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
        
        <view class="setting-item" @click="clearAllData">
          <view class="setting-left">
            <uni-icons type="trash" size="24" class="setting-icon danger" />
            <text class="setting-label danger">Clear All Data</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
        
        <view class="setting-item" @click="addTestData">
          <view class="setting-left">
            <uni-icons type="plus" size="24" class="setting-icon" />
            <text class="setting-label">Add Test Data</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
      </view>

      <!-- 应用设置 -->
      <view class="settings-section">
        <text class="section-title">App Settings</text>
        
        <view class="setting-item">
          <view class="setting-left">
            <uni-icons type="notification" size="24" class="setting-icon" />
            <text class="setting-label">Notifications</text>
          </view>
          <switch :checked="notificationsEnabled" @change="toggleNotifications" />
        </view>
        
        <view class="setting-item">
          <view class="setting-left">
            <uni-icons type="eye" size="24" class="setting-icon" />
            <text class="setting-label">Dark Mode</text>
          </view>
          <switch :checked="darkModeEnabled" @change="toggleDarkMode" />
        </view>
        
        <view class="setting-item" @click="changeCurrency">
          <view class="setting-left">
            <uni-icons type="wallet" size="24" class="setting-icon" />
            <text class="setting-label">Currency</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ currentCurrency }}</text>
            <uni-icons type="right" size="16" class="arrow-icon" />
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="settings-section">
        <text class="section-title">About</text>
        
        <view class="setting-item" @click="showVersion">
          <view class="setting-left">
            <uni-icons type="info" size="24" class="setting-icon" />
            <text class="setting-label">Version</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ appVersion }}</text>
            <uni-icons type="right" size="16" class="arrow-icon" />
          </view>
        </view>
        
        <view class="setting-item" @click="showPrivacy">
          <view class="setting-left">
            <uni-icons type="shield" size="24" class="setting-icon" />
            <text class="setting-label">Privacy Policy</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
        
        <view class="setting-item" @click="showTerms">
          <view class="setting-left">
            <uni-icons type="file-text" size="24" class="setting-icon" />
            <text class="setting-label">Terms of Service</text>
          </view>
          <uni-icons type="right" size="16" class="arrow-icon" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SessionStorage } from '../../utils/storage'
import { InitData } from '../../utils/init-data'

const notificationsEnabled = ref(true)
const darkModeEnabled = ref(false)
const currentCurrency = ref('USD')
const appVersion = ref('1.0.0')

// 导出数据
const exportData = () => {
  try {
    const data = SessionStorage.exportSessions()
    // 在实际应用中，这里应该触发文件下载
    uni.showToast({
      title: '数据导出成功',
      icon: 'success'
    })
    console.log('Exported data:', data)
  } catch (error) {
    uni.showToast({
      title: '导出失败',
      icon: 'error'
    })
  }
}

// 导入数据
const importData = () => {
  uni.showModal({
    title: '导入数据',
    content: '此功能将覆盖现有数据，确定继续吗？',
    success: (res) => {
      if (res.confirm) {
        // 在实际应用中，这里应该触发文件选择
        uni.showToast({
          title: '导入功能待实现',
          icon: 'none'
        })
      }
    }
  })
}

// 清除所有数据
const clearAllData = () => {
  uni.showModal({
    title: '清除所有数据',
    content: '此操作将永久删除所有会话数据，无法恢复。确定继续吗？',
    success: (res) => {
      if (res.confirm) {
        if (SessionStorage.clearAllSessions()) {
          uni.showToast({
            title: '数据已清除',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '清除失败',
            icon: 'error'
          })
        }
      }
    }
  })
}

// 添加测试数据
const addTestData = () => {
  const existingSessions = SessionStorage.getAllSessions()
  
  if (existingSessions.length > 0) {
    uni.showModal({
      title: '添加测试数据',
      content: `当前已有 ${existingSessions.length} 个会话，是否要替换为测试数据？`,
      success: (res) => {
        if (res.confirm) {
          const success = InitData.forceReinitialize()
          if (success) {
            uni.showToast({
              title: '测试数据添加成功',
              icon: 'success',
              duration: 3000
            })
            console.log('测试数据摘要:')
            console.log(InitData.getDataSummary())
          } else {
            uni.showToast({
              title: '添加失败',
              icon: 'error'
            })
          }
        }
      }
    })
  } else {
    const success = InitData.initializeTestData()
    if (success) {
      uni.showToast({
        title: '测试数据添加成功',
        icon: 'success',
        duration: 3000
      })
      console.log('测试数据摘要:')
      console.log(InitData.getDataSummary())
    } else {
      uni.showToast({
        title: '添加失败',
        icon: 'error'
      })
    }
  }
}

// 切换通知
const toggleNotifications = (e: any) => {
  notificationsEnabled.value = e.detail.value
  uni.showToast({
    title: `通知已${notificationsEnabled.value ? '开启' : '关闭'}`,
    icon: 'none'
  })
}

// 切换深色模式
const toggleDarkMode = (e: any) => {
  darkModeEnabled.value = e.detail.value
  uni.showToast({
    title: `深色模式已${darkModeEnabled.value ? '开启' : '关闭'}`,
    icon: 'none'
  })
}

// 更改货币
const changeCurrency = () => {
  uni.showActionSheet({
    itemList: ['USD', 'EUR', 'CNY', 'JPY'],
    success: (res) => {
      const currencies = ['USD', 'EUR', 'CNY', 'JPY']
      currentCurrency.value = currencies[res.tapIndex]
      uni.showToast({
        title: `货币已更改为 ${currentCurrency.value}`,
        icon: 'none'
      })
    }
  })
}

// 显示版本信息
const showVersion = () => {
  uni.showModal({
    title: '版本信息',
    content: `Poker4 v${appVersion.value}\n\n一个简单而强大的扑克会话管理应用。`,
    showCancel: false
  })
}

// 显示隐私政策
const showPrivacy = () => {
  uni.showToast({
    title: '隐私政策功能待实现',
    icon: 'none'
  })
}

// 显示服务条款
const showTerms = () => {
  uni.showToast({
    title: '服务条款功能待实现',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.settings-page {
  background: #fafafa;
  min-height: 100vh;
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
  font-family: 'Fredoka', 'Arial', sans-serif;
}

.settings-list {
  padding: 0 32rpx;
}

.settings-section {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  padding: 24rpx 32rpx 16rpx 32rpx;
  display: block;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.setting-icon {
  color: #6c63ff;
}

.setting-icon.danger {
  color: #f44336;
}

.setting-label {
  font-size: 28rpx;
  color: #333;
}

.setting-label.danger {
  color: #f44336;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.setting-value {
  font-size: 28rpx;
  color: #666;
}

.arrow-icon {
  color: #999;
}
</style> 