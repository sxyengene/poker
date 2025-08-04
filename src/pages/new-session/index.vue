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
        <view class="form-input" @tap="showSessionPicker">
          <text class="input-text">{{ sessionType || "Please select >" }}</text>
        </view>
      </view>

      <!-- Location选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">📍</text>
          <text class="form-label">Location</text>
        </view>
        <view class="form-input" @tap="showLocationPicker">
          <text class="input-text">{{ location || "Please select >" }}</text>
        </view>
      </view>

      <!-- Game选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">🎲</text>
          <text class="form-label">Game</text>
        </view>
        <view class="form-input" @tap="showGamePicker">
          <text class="input-text">{{ game || "Please select >" }}</text>
        </view>
      </view>

      <!-- Stakes选择 -->
      <view class="form-item">
        <view class="form-item-header">
          <text class="form-icon">$</text>
          <text class="form-label">Stakes</text>
        </view>
        <view class="form-input" @tap="showStakesPicker">
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
          <view class="time-input" @tap="showStartDatePicker">
            <text class="time-text">{{ startDate || "Jun 24, 2025" }}</text>
          </view>
          <view class="time-input" @tap="showStartTimePicker">
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
          <view class="time-input" @tap="showEndDatePicker">
            <text class="time-text">{{ endDate || "Jun 24, 2025" }}</text>
          </view>
          <view class="time-input" @tap="showEndTimePicker">
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
      <button class="save-button" @tap="saveSession">Save Session</button>
      <text class="cancel-button" @tap="cancelSession">Cancel</text>
    </view>

    <!-- Session类型选择器弹窗 -->
    <view v-if="showSessionPickerPopup" class="picker-overlay" @tap="closeSessionPicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeSessionPicker">取消</text>
          <text class="ios-picker-title">选择Session类型</text>
          <text class="ios-picker-confirm" @tap="confirmSessionPicker">确定</text>
        </view>
        <view class="ios-picker-content">
          <view 
            class="ios-picker-item" 
            v-for="(item, index) in sessionTypes" 
            :key="index"
            @tap="selectSessionType(index)"
            :class="{ 'selected': index === sessionPickerIndex }"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <!-- Location选择器弹窗 -->
    <view v-if="showLocationPickerPopup" class="picker-overlay" @tap="closeLocationPicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeLocationPicker">取消</text>
          <text class="ios-picker-title">选择位置</text>
          <text class="ios-picker-confirm" @tap="confirmLocationPicker">确定</text>
        </view>
        <picker-view
          class="ios-picker-view"
          :value="[locationPickerIndex]"
          @change="onLocationPickerChange"
        >
          <picker-view-column>
            <view class="ios-picker-item" v-for="(item, index) in locationTypes" :key="index">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>

    <!-- Game选择器弹窗 -->
    <view v-if="showGamePickerPopup" class="picker-overlay" @tap="closeGamePicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeGamePicker">取消</text>
          <text class="ios-picker-title">选择游戏类型</text>
          <text class="ios-picker-confirm" @tap="confirmGamePicker">确定</text>
        </view>
        <picker-view
          class="ios-picker-view"
          :value="[gamePickerIndex]"
          @change="onGamePickerChange"
        >
          <picker-view-column>
            <view class="ios-picker-item" v-for="(item, index) in gameTypes" :key="index">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>

    <!-- Stakes选择器弹窗 -->
    <view v-if="showStakesPickerPopup" class="picker-overlay" @tap="closeStakesPicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeStakesPicker">取消</text>
          <text class="ios-picker-title">选择筹码</text>
          <text class="ios-picker-confirm" @tap="confirmStakesPicker">确定</text>
        </view>
        <picker-view
          class="ios-picker-view"
          :value="[stakesPickerIndex]"
          @change="onStakesPickerChange"
        >
          <picker-view-column>
            <view class="ios-picker-item" v-for="(item, index) in stakesTypes" :key="index">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>

    <!-- 日期选择器弹窗 -->
    <view v-if="showDatePickerPopup" class="picker-overlay" @tap="closeDatePicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeDatePicker">取消</text>
          <text class="ios-picker-title">选择日期</text>
          <text class="ios-picker-confirm" @tap="confirmDatePicker">确定</text>
        </view>
        <picker-view
          class="ios-picker-view"
          :value="[datePickerIndex]"
          @change="onDatePickerChange"
        >
          <picker-view-column>
            <view class="ios-picker-item" v-for="(item, index) in dateOptions" :key="index">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>

    <!-- 时间选择器弹窗 -->
    <view v-if="showTimePickerPopup" class="picker-overlay" @tap="closeTimePicker">
      <view class="ios-picker-container" @tap.stop>
        <view class="ios-picker-header">
          <text class="ios-picker-cancel" @tap="closeTimePicker">取消</text>
          <text class="ios-picker-title">选择时间</text>
          <text class="ios-picker-confirm" @tap="confirmTimePicker">确定</text>
        </view>
        <picker-view
          class="ios-picker-view"
          :value="[timePickerIndex]"
          @change="onTimePickerChange"
        >
          <picker-view-column>
            <view class="ios-picker-item" v-for="(item, index) in timeOptions" :key="index">
              {{ item }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { SessionManager } from "../../models/Session";
import { SESSION_CATEGORIES, GAME_TYPES, STAKES_TYPES } from "../../types";
import type { SessionCategory } from "../../types";
import { SessionStorage } from "../../utils/storage";



// 响应式数据
const sessionType = ref<string>("");
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
const sessionTypes = ["请选择", ...SESSION_CATEGORIES];
const locationTypes = ["请选择", "Home Game", "Casino", "Online", "Private Club", "Other"];
const gameTypes = ["请选择", ...GAME_TYPES];
const stakesTypes = ["请选择", ...STAKES_TYPES];

// 选择器索引
const sessionPickerIndex = ref(0);
const locationPickerIndex = ref(0);
const gamePickerIndex = ref(0);
const stakesPickerIndex = ref(0);
const datePickerIndex = ref(0);
const timePickerIndex = ref(0);

// 临时选择器值
const tempSessionType = ref("");
const tempLocation = ref("");
const tempGame = ref("");
const tempStakes = ref("");
const tempDate = ref("");
const tempTime = ref("");

// 当前选择器类型
const currentPickerType = ref("");

// 日期选项
const dateOptions = ref<string[]>([]);
const timeOptions = ref<string[]>([]);

// 弹窗显示状态
const showSessionPickerPopup = ref(false);
const showLocationPickerPopup = ref(false);
const showGamePickerPopup = ref(false);
const showStakesPickerPopup = ref(false);
const showDatePickerPopup = ref(false);
const showTimePickerPopup = ref(false);

// 弹窗引用（保留用于备用方案）
const sessionPopup = ref();
const locationPopup = ref();
const gamePopup = ref();
const stakesPopup = ref();
const datePopup = ref();
const timePopup = ref();

// 初始化
onMounted(() => {
  updateCurrentTime();
  generateDateOptions();
  generateTimeOptions();
  setInterval(updateCurrentTime, 60000); // 每分钟更新一次时间
});

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  currentTime.value = `${hours}:${minutes}`;
};

// 生成日期选项
const generateDateOptions = () => {
  const options = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    options.push(`${month} ${day}, ${year}`);
  }
  dateOptions.value = options;
};

// 生成时间选项
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push(timeStr);
    }
  }
  timeOptions.value = options;
};

// 显示Session类型选择器
const showSessionPicker = () => {
  console.log("showSessionPicker called");
  currentPickerType.value = "session";
  tempSessionType.value = sessionType.value || "请选择";
  sessionPickerIndex.value = sessionType.value ? sessionTypes.indexOf(sessionType.value) : 0;
  showSessionPickerPopup.value = true;
  console.log("showSessionPickerPopup.value:", showSessionPickerPopup.value);
  console.log("sessionTypes:", sessionTypes);
  console.log("sessionPickerIndex.value:", sessionPickerIndex.value);
  
  // 强制更新视图
  nextTick(() => {
    console.log("nextTick - showSessionPickerPopup.value:", showSessionPickerPopup.value);
  });
};

// Session选择器变化
const onSessionPickerChange = (e: any) => {
  sessionPickerIndex.value = e.detail.value[0];
  tempSessionType.value = sessionTypes[sessionPickerIndex.value];
};

// 选择Session类型
const selectSessionType = (index: number) => {
  sessionPickerIndex.value = index;
  tempSessionType.value = sessionTypes[index];
};

// 确认Session选择
const confirmSessionPicker = () => {
  if (tempSessionType.value === "请选择") {
    sessionType.value = "";
  } else {
    sessionType.value = tempSessionType.value;
  }
  showSessionPickerPopup.value = false;
};

// 关闭Session选择器
const closeSessionPicker = () => {
  showSessionPickerPopup.value = false;
};

// 显示位置选择器
const showLocationPicker = () => {
  currentPickerType.value = "location";
  tempLocation.value = location.value || "请选择";
  locationPickerIndex.value = location.value ? locationTypes.indexOf(location.value) : 0;
  showLocationPickerPopup.value = true;
};

// Location选择器变化
const onLocationPickerChange = (e: any) => {
  locationPickerIndex.value = e.detail.value[0];
  tempLocation.value = locationTypes[locationPickerIndex.value];
};

// 确认Location选择
const confirmLocationPicker = () => {
  if (tempLocation.value === "请选择") {
    location.value = "";
  } else {
    location.value = tempLocation.value;
  }
  showLocationPickerPopup.value = false;
};

// 关闭Location选择器
const closeLocationPicker = () => {
  showLocationPickerPopup.value = false;
};

// 显示游戏选择器
const showGamePicker = () => {
  currentPickerType.value = "game";
  tempGame.value = game.value || "请选择";
  gamePickerIndex.value = game.value ? gameTypes.indexOf(game.value) : 0;
  showGamePickerPopup.value = true;
};

// Game选择器变化
const onGamePickerChange = (e: any) => {
  gamePickerIndex.value = e.detail.value[0];
  tempGame.value = gameTypes[gamePickerIndex.value];
};

// 确认Game选择
const confirmGamePicker = () => {
  if (tempGame.value === "请选择") {
    game.value = "";
  } else {
    game.value = tempGame.value;
  }
  showGamePickerPopup.value = false;
};

// 关闭Game选择器
const closeGamePicker = () => {
  showGamePickerPopup.value = false;
};

// 显示筹码选择器
const showStakesPicker = () => {
  currentPickerType.value = "stakes";
  tempStakes.value = stakes.value || "请选择";
  stakesPickerIndex.value = stakes.value ? stakesTypes.indexOf(stakes.value) : 0;
  showStakesPickerPopup.value = true;
};

// Stakes选择器变化
const onStakesPickerChange = (e: any) => {
  stakesPickerIndex.value = e.detail.value[0];
  tempStakes.value = stakesTypes[stakesPickerIndex.value];
};

// 确认Stakes选择
const confirmStakesPicker = () => {
  if (tempStakes.value === "请选择") {
    stakes.value = "";
  } else {
    stakes.value = tempStakes.value;
  }
  showStakesPickerPopup.value = false;
};

// 关闭Stakes选择器
const closeStakesPicker = () => {
  showStakesPickerPopup.value = false;
};

// 显示开始日期选择器
const showStartDatePicker = () => {
  currentPickerType.value = "startDate";
  tempDate.value = startDate.value;
  datePickerIndex.value = dateOptions.value.indexOf(startDate.value) >= 0 ? dateOptions.value.indexOf(startDate.value) : 0;
  showDatePickerPopup.value = true;
};

// 显示开始时间选择器
const showStartTimePicker = () => {
  currentPickerType.value = "startTime";
  tempTime.value = startTime.value;
  timePickerIndex.value = timeOptions.value.indexOf(startTime.value) >= 0 ? timeOptions.value.indexOf(startTime.value) : 0;
  showTimePickerPopup.value = true;
};

// 显示结束日期选择器
const showEndDatePicker = () => {
  currentPickerType.value = "endDate";
  tempDate.value = endDate.value;
  datePickerIndex.value = dateOptions.value.indexOf(endDate.value) >= 0 ? dateOptions.value.indexOf(endDate.value) : 0;
  showDatePickerPopup.value = true;
};

// 显示结束时间选择器
const showEndTimePicker = () => {
  currentPickerType.value = "endTime";
  tempTime.value = endTime.value;
  timePickerIndex.value = timeOptions.value.indexOf(endTime.value) >= 0 ? timeOptions.value.indexOf(endTime.value) : 0;
  showTimePickerPopup.value = true;
};

// 日期选择器变化
const onDatePickerChange = (e: any) => {
  datePickerIndex.value = e.detail.value[0];
  tempDate.value = dateOptions.value[datePickerIndex.value];
};

// 时间选择器变化
const onTimePickerChange = (e: any) => {
  timePickerIndex.value = e.detail.value[0];
  tempTime.value = timeOptions.value[timePickerIndex.value];
};

// 确认日期选择
const confirmDatePicker = () => {
  if (currentPickerType.value === "startDate") {
    startDate.value = tempDate.value;
  } else if (currentPickerType.value === "endDate") {
    endDate.value = tempDate.value;
  }
  showDatePickerPopup.value = false;
};

// 确认时间选择
const confirmTimePicker = () => {
  if (currentPickerType.value === "startTime") {
    startTime.value = tempTime.value;
  } else if (currentPickerType.value === "endTime") {
    endTime.value = tempTime.value;
  }
  showTimePickerPopup.value = false;
};

// 关闭日期选择器
const closeDatePicker = () => {
  showDatePickerPopup.value = false;
};

// 关闭时间选择器
const closeTimePicker = () => {
  showTimePickerPopup.value = false;
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
    // 类型检查确保sessionType是有效的SessionCategory
    if (sessionType.value === "请选择" || sessionType.value === "") {
      uni.showToast({
        title: "请选择Session类型",
        icon: "none",
      });
      return;
    }
    
    if (sessionType.value !== "Cash Game" && sessionType.value !== "Tournament") {
      uni.showToast({
        title: "请选择有效的Session类型",
        icon: "none",
      });
      return;
    }

    // 创建会话数据
    const sessionData = {
      sessionType: {
        session: sessionType.value as SessionCategory,
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
  padding-bottom: 140px; /* 为底部按钮留出更多空间 */
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
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

/* 选择器遮罩层 */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* iOS风格选择器弹窗 */
.ios-picker-container {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 1000;
  width: 80%;
  max-width: 400px;
  max-height: 80vh;
}

.ios-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

.ios-picker-cancel {
  color: #007aff;
  font-size: 16px;
  font-weight: 400;
}

.ios-picker-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.ios-picker-confirm {
  color: #007aff;
  font-size: 16px;
  font-weight: 600;
}

.ios-picker-view {
  height: 300px;
  background-color: white;
}

.ios-picker-content {
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
}

.ios-picker-item {
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #333;
  font-weight: 400;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.ios-picker-item.selected {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* 选择器高亮效果 */
.ios-picker-view picker-view-column {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    #f0f0f0 40%,
    #f0f0f0 60%,
    transparent 60%,
    transparent 100%
  );
}
</style>
