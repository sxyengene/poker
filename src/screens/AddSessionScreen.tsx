import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddSessionScreen() {
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'completed', 'transaction'
  const [liveSession, setLiveSession] = useState({
    location: '',
    buyin: '',
    blinds: '',
    isRunning: false,
    startTime: null as Date | null,
  });

  const [completedSession, setCompletedSession] = useState({
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    buyin: '',
    cashout: '',
    blinds: '',
    gameType: "NL Hold'em",
    notes: '',
  });

  const [transaction, setTransaction] = useState({
    type: 'deposit', // 'deposit', 'withdrawal', 'transfer'
    amount: '',
    description: '',
    date: '',
  });

  const startLiveSession = () => {
    if (!liveSession.location || !liveSession.buyin) {
      Alert.alert('错误', '请填写地点和买入金额');
      return;
    }

    setLiveSession({
      ...liveSession,
      isRunning: true,
      startTime: new Date(),
    });

    Alert.alert('会话已开始', '实时监测已启动，祝您好运！');
  };

  const endLiveSession = () => {
    Alert.alert('结束会话', '确定要结束当前会话吗？', [
      {text: '取消', style: 'cancel'},
      {
        text: '结束',
        style: 'default',
        onPress: () => {
          setLiveSession({
            ...liveSession,
            isRunning: false,
            startTime: null,
          });
          Alert.alert('会话已结束', '数据已保存到会话记录');
        },
      },
    ]);
  };

  const saveCompletedSession = () => {
    if (
      !completedSession.location ||
      !completedSession.buyin ||
      !completedSession.cashout
    ) {
      Alert.alert('错误', '请填写必填字段');
      return;
    }

    Alert.alert('保存成功', '会话记录已添加');
    // 重置表单
    setCompletedSession({
      location: '',
      date: '',
      startTime: '',
      endTime: '',
      buyin: '',
      cashout: '',
      blinds: '',
      gameType: "NL Hold'em",
      notes: '',
    });
  };

  const saveTransaction = () => {
    if (!transaction.amount) {
      Alert.alert('错误', '请填写交易金额');
      return;
    }

    Alert.alert('保存成功', '交易记录已添加');
    // 重置表单
    setTransaction({
      type: 'deposit',
      amount: '',
      description: '',
      date: '',
    });
  };

  const renderLiveSessionTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>实时游戏追踪</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>游戏地点 *</Text>
          <TextInput
            style={styles.textInput}
            value={liveSession.location}
            onChangeText={text =>
              setLiveSession({...liveSession, location: text})
            }
            placeholder="如：Crown Casino"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>买入金额 *</Text>
          <TextInput
            style={styles.textInput}
            value={liveSession.buyin}
            onChangeText={text => setLiveSession({...liveSession, buyin: text})}
            placeholder="1000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>盲注级别</Text>
          <TextInput
            style={styles.textInput}
            value={liveSession.blinds}
            onChangeText={text =>
              setLiveSession({...liveSession, blinds: text})
            }
            placeholder="如：2/5"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {liveSession.isRunning && (
          <View style={styles.liveSessionInfo}>
            <Icon name="radio-button-checked" size={16} color="#22C55E" />
            <Text style={styles.liveSessionText}>
              会话进行中 - 开始时间:{' '}
              {liveSession.startTime?.toLocaleTimeString()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {backgroundColor: liveSession.isRunning ? '#EF4444' : '#22C55E'},
          ]}
          onPress={liveSession.isRunning ? endLiveSession : startLiveSession}>
          <Icon
            name={liveSession.isRunning ? 'stop' : 'play-arrow'}
            size={20}
            color="white"
          />
          <Text style={styles.primaryButtonText}>
            {liveSession.isRunning ? '结束会话' : '开始追踪'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCompletedSessionTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>补录会话记录</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>游戏地点 *</Text>
          <TextInput
            style={styles.textInput}
            value={completedSession.location}
            onChangeText={text =>
              setCompletedSession({...completedSession, location: text})
            }
            placeholder="如：Star City"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
            <Text style={styles.inputLabel}>买入金额 *</Text>
            <TextInput
              style={styles.textInput}
              value={completedSession.buyin}
              onChangeText={text =>
                setCompletedSession({...completedSession, buyin: text})
              }
              placeholder="1000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
            <Text style={styles.inputLabel}>结算金额 *</Text>
            <TextInput
              style={styles.textInput}
              value={completedSession.cashout}
              onChangeText={text =>
                setCompletedSession({...completedSession, cashout: text})
              }
              placeholder="1500"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
            <Text style={styles.inputLabel}>盲注级别</Text>
            <TextInput
              style={styles.textInput}
              value={completedSession.blinds}
              onChangeText={text =>
                setCompletedSession({...completedSession, blinds: text})
              }
              placeholder="1/3"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
            <Text style={styles.inputLabel}>游戏类型</Text>
            <TextInput
              style={styles.textInput}
              value={completedSession.gameType}
              onChangeText={text =>
                setCompletedSession({...completedSession, gameType: text})
              }
              placeholder="NL Hold'em"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>备注</Text>
          <TextInput
            style={[styles.textInput, {height: 80}]}
            value={completedSession.notes}
            onChangeText={text =>
              setCompletedSession({...completedSession, notes: text})
            }
            placeholder="会话记录或注意事项..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={saveCompletedSession}>
          <Icon name="save" size={20} color="white" />
          <Text style={styles.primaryButtonText}>保存会话</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTransactionTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>交易记录</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>交易类型</Text>
          <View style={styles.transactionTypes}>
            {[
              {key: 'deposit', label: '存款', icon: 'add-circle-outline'},
              {key: 'withdrawal', label: '取款', icon: 'remove-circle-outline'},
              {key: 'transfer', label: '转账', icon: 'swap-horiz'},
            ].map(type => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.transactionType,
                  {
                    backgroundColor:
                      transaction.type === type.key ? '#3B82F6' : '#F3F4F6',
                  },
                ]}
                onPress={() =>
                  setTransaction({...transaction, type: type.key})
                }>
                <Icon
                  name={type.icon}
                  size={16}
                  color={transaction.type === type.key ? 'white' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    {
                      color:
                        transaction.type === type.key ? 'white' : '#6B7280',
                    },
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>交易金额 *</Text>
          <TextInput
            style={styles.textInput}
            value={transaction.amount}
            onChangeText={text =>
              setTransaction({...transaction, amount: text})
            }
            placeholder="500"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>描述</Text>
          <TextInput
            style={styles.textInput}
            value={transaction.description}
            onChangeText={text =>
              setTransaction({...transaction, description: text})
            }
            placeholder="如：银行存款、提取现金等"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={saveTransaction}>
          <Icon name="save" size={20} color="white" />
          <Text style={styles.primaryButtonText}>保存交易</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 顶部导航标签 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            {backgroundColor: activeTab === 'live' ? '#3B82F6' : 'transparent'},
          ]}
          onPress={() => setActiveTab('live')}>
          <Icon
            name="play-circle-outline"
            size={20}
            color={activeTab === 'live' ? 'white' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'live' ? 'white' : '#6B7280'},
            ]}>
            实时追踪
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'completed' ? '#3B82F6' : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('completed')}>
          <Icon
            name="event"
            size={20}
            color={activeTab === 'completed' ? 'white' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'completed' ? 'white' : '#6B7280'},
            ]}>
            补录会话
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'transaction' ? '#3B82F6' : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('transaction')}>
          <Icon
            name="swap-horiz"
            size={20}
            color={activeTab === 'transaction' ? 'white' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'transaction' ? 'white' : '#6B7280'},
            ]}>
            交易记录
          </Text>
        </TouchableOpacity>
      </View>

      {/* 标签内容 */}
      {activeTab === 'live' && renderLiveSessionTab()}
      {activeTab === 'completed' && renderCompletedSessionTab()}
      {activeTab === 'transaction' && renderTransactionTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    paddingBottom: 80,
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
  },
  liveSessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  liveSessionText: {
    marginLeft: 8,
    color: '#059669',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionType: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  transactionTypeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});
