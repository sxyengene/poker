import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [useSystemDisplay, setUseSystemDisplay] = useState(false);
  const [incognitoBankroll, setIncognitoBankroll] = useState(false);

  const handleProUpgrade = () => {
    Alert.alert(
      'Left Pocket Pro',
      '升级到Pro版本获得更多功能:\n• 无限制会话记录\n• 高级统计分析\n• 数据导出功能\n• 专属客服支持',
      [
        {text: '取消', style: 'cancel'},
        {text: '了解更多', style: 'default'},
      ],
    );
  };

  const handleLocations = () => {
    Alert.alert(
      'Locations',
      '管理您的游戏地点:\n• 添加常用赌场\n• 设置默认地点\n• 长按编辑现有地点',
      [{text: '确定', style: 'default'}],
    );
  };

  const handlePushNotifications = () => {
    Alert.alert(
      'Push Notifications',
      '配置通知设置:\n• 盈利目标提醒\n• 会话结束提醒\n• 每日统计摘要',
      [{text: '确定', style: 'default'}],
    );
  };

  const handleSessionDefaults = () => {
    Alert.alert(
      'Session Defaults',
      '设置默认值:\n• 常用盲注级别\n• 默认游戏类型\n• 默认买入金额',
      [{text: '确定', style: 'default'}],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>设置</Text>
        </View>

        {/* Pro版本推广 */}
        <TouchableOpacity style={styles.proCard} onPress={handleProUpgrade}>
          <Text style={styles.proTitle}>✨ 试用 Left Pocket Pro ✨</Text>
        </TouchableOpacity>

        {/* 设置选项 */}
        <View style={styles.settingsGroup}>
          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>深色模式</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{false: '#E5E7EB', true: '#6B7280'}}
              thumbColor={darkMode ? '#ffffff' : '#ffffff'}
              style={styles.switch}
            />
          </View>

          {/* Use System Display */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>使用系统显示</Text>
              <Text style={styles.settingDescription}>
                使用系统显示设置将覆盖深色模式{'\n'}
                并采用您当前设备的显示偏好。
              </Text>
            </View>
            <Switch
              value={useSystemDisplay}
              onValueChange={setUseSystemDisplay}
              trackColor={{false: '#E5E7EB', true: '#6B7280'}}
              thumbColor={useSystemDisplay ? '#ffffff' : '#ffffff'}
              style={styles.switch}
            />
          </View>

          {/* Incognito Bankroll */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>隐身资金</Text>
              <Text style={styles.settingDescription}>
                在仪表板中隐藏您的资金余额{'\n'}
                以保护敏感信息。
              </Text>
            </View>
            <Switch
              value={incognitoBankroll}
              onValueChange={setIncognitoBankroll}
              trackColor={{false: '#E5E7EB', true: '#6B7280'}}
              thumbColor={incognitoBankroll ? '#ffffff' : '#ffffff'}
              style={styles.switch}
            />
          </View>
        </View>

        {/* 其他设置选项 */}
        <View style={styles.optionsGroup}>
          {/* Locations */}
          <TouchableOpacity style={styles.optionItem} onPress={handleLocations}>
            <Text style={styles.optionTitle}>地点管理</Text>
            <Icon name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.optionDescription}>
            添加您自己的赌场、平台或家庭游戏。{'\n'}
            如需修改地点，请长按其缩略图。
          </Text>

          {/* Push Notifications */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handlePushNotifications}>
            <Text style={styles.optionTitle}>推送通知</Text>
            <Icon name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Session Defaults */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleSessionDefaults}>
            <Text style={styles.optionTitle}>会话默认值</Text>
            <Icon name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  proCard: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 32,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    marginHorizontal: 32,
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  switch: {
    transform: [{scaleX: 1.1}, {scaleY: 1.1}],
  },
  optionsGroup: {
    marginHorizontal: 32,
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
});
