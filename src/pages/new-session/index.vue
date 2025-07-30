<template>
  <view class="new-session-container">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text class="time">{{ currentTime }}</text>
      <view class="status-right">
        <text class="signal">!!! 5G</text>
        <text class="battery">50</text>
      </view>
    </view>

    <!-- 页面标题 -->
    <view class="page-title">
      <text class="title-text">New Session</text>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-container" scroll-y="true">
      <!-- Session类型选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">♣</text>
          <text class="form-label">Session</text>
        </view>
        <view class="form-input" @click="showSessionPicker">
          <text class="input-text">{{ sessionType || "Please select >" }}</text>
        </view>
      </view>

      <!-- Location选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">📍</text>
          <text class="form-label">Location</text>
        </view>
        <view class="form-input" @click="showLocationPicker">
          <text class="input-text">{{ location || "Please select >" }}</text>
        </view>
      </view>

      <!-- Game选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">🎲</text>
          <text class="form-label">Game</text>
        </view>
        <view class="form-input" @click="showGamePicker">
          <text class="input-text">{{ game || "Please select >" }}</text>
        </view>
      </view>

      <!-- Stakes选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">$</text>
          <text class="form-label">Stakes</text>
        </view>
        <view class="form-input" @click="showStakesPicker">
          <text class="input-text">{{ stakes || "Please select >" }}</text>
        </view>
      </view>

      <!-- Start时间 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">⏰</text>
          <text class="form-label">Start</text>
        </view>
        <view class="time-input-container">
          <view class="time-input" @click="showStartDatePicker">
            <text class="time-text">{{ startDate || "Jun 24, 2025" }}</text>
          </view>
          <view class="time-input" @click="showStartTimePicker">
            <text class="time-text">{{ startTime || "06:40" }}</text>
          </view>
        </view>
      </view>

      <!-- End时间 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">⏳</text>
          <text class="form-label">End</text>
        </view>
        <view class="time-input-container">
          <view class="time-input" @click="showEndDatePicker">
            <text class="time-text">{{ endDate || "Jun 24, 2025" }}</text>
          </view>
          <view class="time-input" @click="showEndTimePicker">
            <text class="time-text">{{ endTime || "11:40" }}</text>
          </view>
        </view>
      </view>

      <!-- 金额输入区域 -->
      <view class="amount-inputs">
        <view class="amount-row">
          <view class="amount-input">
            <text class="amount-label">$</text>
            <input
              class="amount-field"
              type="number"
              placeholder="Buy In"
              v-model="buyIn"
            />
          </view>
          <view class="amount-input">
            <text class="amount-label">$</text>
            <input
              class="amount-field"
              type="number"
              placeholder="Cash Out"
              v-model="cashOut"
            />
          </view>
        </view>

        <view class="amount-input full-width">
          <text class="amount-label">$</text>
          <input
            class="amount-field"
            type="number"
            placeholder="Rebuys / Top Offs"
            v-model="rebuys"
          />
        </view>

        <view class="amount-input full-width">
          <text class="amount-label">$</text>
          <input
            class="amount-field"
            type="number"
            placeholder="Table Expenses (Rake, tips)"
            v-model="tableExpenses"
          />
        </view>

        <view class="amount-input full-width">
          <text class="amount-label">$</text>
          <input
            class="amount-field"
            type="number"
            placeholder="High Hand Bonus (Optional)"
            v-model="highHandBonus"
          />
        </view>
      </view>

      <!-- Notes -->
      <view class="notes-container">
        <textarea
          class="notes-input"
          placeholder="Notes (Optional)"
          v-model="notes"
          maxlength="500"
        />
      </view>

      <!-- Tags -->
      <view class="tags-container">
        <view class="tags-input">
          <text class="tags-icon">🏷️</text>
          <input
            class="tags-field"
            placeholder="Tags (Optional)"
            v-model="tagInput"
            @confirm="addTag"
          />
          <text class="lock-icon">🔒</text>
        </view>
        <view class="tags-list" v-if="tags.length > 0">
          <view
            class="tag-item"
            v-for="(tag, index) in tags"
            :key="index"
            @click="removeTag(index)"
          >
            <text class="tag-text">{{ tag }}</text>
            <text class="tag-remove">×</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <button class="save-button" @click="saveSession">Save Session</button>
      <text class="cancel-button" @click="cancelSession">Cancel</text>
    </view>

    <!-- 选择器弹窗 -->
    <uni-popup ref="sessionPopup" type="bottom">
      <view class="picker-container">
        <view class="picker-header">
          <text class="picker-title">选择Session类型</text>
          <text class="picker-close" @click="closePopup">关闭</text>
        </view>
        <picker-view
          class="picker-view"
          :value="sessionPickerIndex"
          @change="onSessionPickerChange"
        >
          <picker-view-column>
            <view class="picker-item" v-for="item in sessionTypes" :key="item">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { SessionManager } from "../../models/Session";
import { SESSION_CATEGORIES, GAME_TYPES, STAKES_TYPES } from "../../types";
import { SessionStorage } from "../../utils/storage";

// 响应式数据
const sessionType = ref("");
const location = ref("");
const game = ref("");
const stakes = ref("");
const startDate = ref("Jun 24, 2025");
const startTime = ref("06:40");
const endDate = ref("Jun 24, 2025");
const endTime = ref("11:40");
const buyIn = ref("");
const cashOut = ref("");
const rebuys = ref("");
const tableExpenses = ref("");
const highHandBonus = ref("");
const notes = ref("");
const tagInput = ref("");
const tags = ref<string[]>([]);

// 当前时间
const currentTime = ref("11:42");

// Session管理器
const sessionManager = new SessionManager();

// 选择器数据
const sessionTypes = SESSION_CATEGORIES;
const gameTypes = GAME_TYPES;
const stakesTypes = STAKES_TYPES;
const sessionPickerIndex = ref(0);

// 弹窗引用
const sessionPopup = ref();

// 初始化
onMounted(() => {
  updateCurrentTime();
  setInterval(updateCurrentTime, 60000); // 每分钟更新一次时间
});

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  currentTime.value = `${hours}:${minutes}`;
};

// 显示Session类型选择器
const showSessionPicker = () => {
  sessionPopup.value.open();
};

// Session选择器变化
const onSessionPickerChange = (e: any) => {
  sessionPickerIndex.value = e.detail.value[0];
  sessionType.value = sessionTypes[sessionPickerIndex.value];
};

// 关闭弹窗
const closePopup = () => {
  sessionPopup.value.close();
};

// 显示位置选择器
const showLocationPicker = () => {
  // 这里可以实现位置选择逻辑
  uni.showToast({
    title: "位置选择功能待实现",
    icon: "none",
  });
};

// 显示游戏选择器
const showGamePicker = () => {
  // 这里可以实现游戏选择逻辑
  uni.showToast({
    title: "游戏选择功能待实现",
    icon: "none",
  });
};

// 显示筹码选择器
const showStakesPicker = () => {
  // 这里可以实现筹码选择逻辑
  uni.showToast({
    title: "筹码选择功能待实现",
    icon: "none",
  });
};

// 显示开始日期选择器
const showStartDatePicker = () => {
  // 临时使用提示，后续可以集成日期选择器
  uni.showToast({
    title: "日期选择功能待完善",
    icon: "none",
  });
};

// 显示开始时间选择器
const showStartTimePicker = () => {
  // 临时使用提示，后续可以集成时间选择器
  uni.showToast({
    title: "时间选择功能待完善",
    icon: "none",
  });
};

// 显示结束日期选择器
const showEndDatePicker = () => {
  // 临时使用提示，后续可以集成日期选择器
  uni.showToast({
    title: "日期选择功能待完善",
    icon: "none",
  });
};

// 显示结束时间选择器
const showEndTimePicker = () => {
  // 临时使用提示，后续可以集成时间选择器
  uni.showToast({
    title: "时间选择功能待完善",
    icon: "none",
  });
};

// 添加标签
const addTag = () => {
  if (tagInput.value.trim() && !tags.value.includes(tagInput.value.trim())) {
    tags.value.push(tagInput.value.trim());
    tagInput.value = "";
  }
};

// 移除标签
const removeTag = (index: number) => {
  tags.value.splice(index, 1);
};

// 保存会话
const saveSession = () => {
  // 验证必填字段
  if (!sessionType.value || !location.value || !game.value || !stakes.value) {
    uni.showToast({
      title: "请填写必填字段",
      icon: "none",
    });
    return;
  }

  if (!buyIn.value || !cashOut.value) {
    uni.showToast({
      title: "请填写买入和兑出金额",
      icon: "none",
    });
    return;
  }

  try {
    // 创建会话数据
    const sessionData = {
      sessionType: {
        session: sessionType.value as any,
        location: location.value,
        game: game.value,
        stakes: stakes.value,
        isTournament: sessionType.value === "Tournament",
      },
      startTime: new Date(`${startDate.value} ${startTime.value}`),
      endTime: new Date(`${endDate.value} ${endTime.value}`),
      buyIn: parseFloat(buyIn.value),
      cashOut: parseFloat(cashOut.value),
      rebuys: parseFloat(rebuys.value) || 0,
      tableExpenses: parseFloat(tableExpenses.value) || 0,
      notes: notes.value,
      tags: tags.value,
    };

    // 使用存储工具类保存会话
    const success = SessionStorage.saveSession(sessionData);

    if (success) {
      uni.showToast({
        title: "会话保存成功",
        icon: "success",
      });

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: "保存失败，请重试",
        icon: "none",
      });
    }
  } catch (error) {
    uni.showToast({
      title: "保存失败，请重试",
      icon: "none",
    });
  }
};

// 取消会话
const cancelSession = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.new-session-container {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
}

.time {
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

/* 页面标题 */
.page-title {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* 表单容器 */
.form-container {
  flex: 1;
  padding: 20px;
}

/* 表单项 */
.form-item {
  margin-bottom: 20px;
}

.form-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.form-icon {
  font-size: 18px;
  margin-right: 8px;
}

.form-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.form-input {
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.input-text {
  color: #666;
  font-size: 16px;
}

/* 时间输入容器 */
.time-input-container {
  display: flex;
  gap: 10px;
}

.time-input {
  flex: 1;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.time-text {
  color: #666;
  font-size: 16px;
}

/* 金额输入区域 */
.amount-inputs {
  margin-top: 20px;
}

.amount-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.amount-input {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.amount-input.full-width {
  margin-bottom: 15px;
}

.amount-label {
  color: #666;
  font-size: 16px;
  margin-right: 8px;
}

.amount-field {
  flex: 1;
  font-size: 16px;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.amount-field::placeholder {
  color: #999;
}

/* Notes容器 */
.notes-container {
  margin-top: 20px;
}

.notes-input {
  width: 100%;
  min-height: 100px;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  color: #333;
  resize: none;
}

.notes-input::placeholder {
  color: #999;
}

/* Tags容器 */
.tags-container {
  margin-top: 20px;
}

.tags-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.tags-icon {
  font-size: 16px;
  margin-right: 8px;
}

.tags-field {
  flex: 1;
  font-size: 16px;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.tags-field::placeholder {
  color: #999;
}

.lock-icon {
  font-size: 14px;
  color: #999;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  background-color: #e3f2fd;
  padding: 6px 12px;
  border-radius: 16px;
  gap: 6px;
}

.tag-text {
  font-size: 14px;
  color: #1976d2;
}

.tag-remove {
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

/* 底部按钮 */
.bottom-buttons {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.save-button {
  width: 100%;
  background-color: #673ab7;
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  border: none;
  margin-bottom: 12px;
}

.cancel-button {
  display: block;
  text-align: center;
  color: #f44336;
  font-size: 16px;
  cursor: pointer;
}

/* 选择器弹窗 */
.picker-container {
  background-color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.picker-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.picker-close {
  color: #666;
  font-size: 16px;
}

.picker-view {
  height: 200px;
}

.picker-item {
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #333;
}
</style>
