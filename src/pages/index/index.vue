<template>
  <view class="content">
    <view class="header">
      <text class="app-title">Poker4111</text>
      <text class="app-subtitle">扑克会话管理</text>
    </view>

    <view class="stats-container">
      <view class="stat-item">
        <text class="stat-number">{{ totalSessions }}</text>
        <text class="stat-label">总会话</text>
      </view>
      <view class="stat-item">
        <text
          class="stat-number"
          :class="{ profit: totalProfit >= 0, loss: totalProfit < 0 }"
        >
          ${{ totalProfit >= 0 ? "+" : "" }}{{ totalProfit }}
        </text>
        <text class="stat-label">总利润</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ winRate }}%</text>
        <text class="stat-label">胜率</text>
      </view>
    </view>

    <view class="action-buttons">
      <button class="new-session-btn" @click="navigateToNewSession">
        <text class="btn-icon">+</text>
        <text class="btn-text">新建会话</text>
      </button>

      <button class="view-sessions-btn" @click="viewSessions">
        <text class="btn-icon">📊</text>
        <text class="btn-text">查看会话</text>
      </button>
    </view>

    <view class="recent-sessions" v-if="recentSessions.length > 0">
      <text class="section-title">最近会话</text>
      <view class="session-list">
        <view
          class="session-item"
          v-for="session in recentSessions"
          :key="session.id"
          @click="viewSessionDetail(session)"
        >
          <view class="session-header">
            <text class="session-type">{{ session.sessionType.session }}</text>
            <text
              class="session-profit"
              :class="{ profit: session.profit >= 0, loss: session.profit < 0 }"
            >
              ${{ session.profit >= 0 ? "+" : "" }}{{ session.profit }}
            </text>
          </view>
          <view class="session-details">
            <text class="session-location">{{
              session.sessionType.location
            }}</text>
            <text class="session-time">{{
              formatDate(session.startTime)
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SessionStorage } from "../../utils/storage";

const totalSessions = ref(0);
const totalProfit = ref(0);
const winRate = ref(0);
const recentSessions = ref<any[]>([]);

// 导航到新建会话页面
const navigateToNewSession = () => {
  uni.navigateTo({
    url: "/pages/new-session/index",
  });
};

// 查看所有会话
const viewSessions = () => {
  uni.showToast({
    title: "会话列表功能待实现",
    icon: "none",
  });
};

// 查看会话详情
const viewSessionDetail = (session: any) => {
  uni.showToast({
    title: "会话详情功能待实现",
    icon: "none",
  });
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 计算统计数据
const calculateStats = () => {
  const sessions = SessionStorage.getAllSessions();
  const stats = SessionStorage.getSessionStats();

  totalSessions.value = stats.totalSessions;
  totalProfit.value = stats.totalProfit;
  winRate.value = Math.round(stats.winRate);

  if (sessions && sessions.length > 0) {
    // 获取最近5个会话
    recentSessions.value = sessions
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((session: any) => ({
        ...session,
        profit:
          session.cashOut -
          session.buyIn -
          (session.rebuys || 0) -
          (session.tableExpenses || 0),
      }));
  }
};

onMounted(() => {
  calculateStats();
});

// 监听页面显示，刷新数据
// uni.onShow(() => {
//   calculateStats();
// });
</script>

<style scoped>
.content {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.app-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 16px;
  color: #666;
  display: block;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.stat-number.profit {
  color: #4caf50;
}

.stat-number.loss {
  color: #f44336;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.action-buttons {
  margin-bottom: 30px;
}

.new-session-btn,
.view-sessions-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.new-session-btn {
  background-color: #673ab7;
  color: white;
}

.view-sessions-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 16px;
}

.recent-sessions {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  display: block;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.session-type {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.session-profit {
  font-size: 16px;
  font-weight: 500;
}

.session-profit.profit {
  color: #4caf50;
}

.session-profit.loss {
  color: #f44336;
}

.session-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-location {
  font-size: 14px;
  color: #666;
}

.session-time {
  font-size: 14px;
  color: #999;
}
</style>
