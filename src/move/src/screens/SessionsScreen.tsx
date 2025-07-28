import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSessions} from '../contexts/SessionsContext';
import FilterModal, {FilterOptions} from '../components/FilterModal';
import OptionPanel from '../components/OptionPanel';
import {findNodeHandle} from 'react-native';

const SessionsScreen = () => {
  const {
    sessions,
    loading,
    error,
    deleteSession,
    filters,
    availableLocations,
    availableGameTypes,
    availableStakes,
    availableTags,
    applyFilters,
  } = useSessions();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const filterBtnRef = React.useRef<TouchableOpacity>(null);
  const [optionPanelVisible, setOptionPanelVisible] = useState(false);
  const [optionPanelPos, setOptionPanelPos] = useState({top: 80, right: 20});

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert('删除会话', '确定要删除这个会话吗？此操作无法撤销。', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteSession(sessionId),
      },
    ]);
  };

  const handleFilterPress = () => {
    if (filterBtnRef.current) {
      filterBtnRef.current.measureInWindow((x, y, width, height) => {
        // 右对齐，top 在按钮底部 8px
        setOptionPanelPos({
          top: y + height + 8,
          right: Dimensions.get('window').width - (x + width),
        });
        setOptionPanelVisible(true);
      });
    } else {
      setOptionPanelVisible(true);
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    applyFilters(newFilters);
  };

  const handleSessionTypeSelect = (value: string) => {
    const newSessionType = value as 'All' | 'Cash Game' | 'Tournament';
    const finalSessionType =
      filters.sessionType === newSessionType ? 'All' : newSessionType;
    applyFilters({...filters, sessionType: finalSessionType});
  };

  const handleLocationSelect = (value: string) => {
    const newValues = [...filters.location];
    const index = newValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      newValues.push(value);
    }
    applyFilters({...filters, location: newValues});
  };

  const handleGameTypeSelect = (value: string) => {
    const newValues = [...filters.gameType];
    const index = newValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      newValues.push(value);
    }
    applyFilters({...filters, gameType: newValues});
  };

  const handleStakesSelect = (value: string) => {
    const newValues = [...filters.stakes];
    const index = newValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      newValues.push(value);
    }
    applyFilters({...filters, stakes: newValues});
  };

  const handleTagsSelect = (value: string) => {
    const newValues = [...filters.tags];
    const index = newValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      newValues.push(value);
    }
    applyFilters({...filters, tags: newValues});
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="error-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>All Sessions</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            ref={filterBtnRef}
            style={styles.iconButton}
            onPress={handleFilterPress}>
            <Icon name="tune" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 会话列表 */}
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="event-note" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>还没有会话记录</Text>
          <Text style={styles.emptySubtitle}>
            点击 + 按钮添加你的第一个扑克会话
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.sessionsList}
          contentContainerStyle={styles.sessionsListContent}
          showsVerticalScrollIndicator={false}>
          {sessions.map((session, index) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionItem}
              onLongPress={() => handleDeleteSession(session.id)}>
              <View style={styles.sessionContent}>
                <Text style={styles.sessionId}>{index + 1}</Text>
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionLocation}>{session.location}</Text>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionGameInfo}>
                    {session.gameType} • {session.blinds} • {session.duration}
                  </Text>
                </View>
                <View style={styles.profitContainer}>
                  <Text
                    style={[
                      styles.profitText,
                      {color: session.profit >= 0 ? '#4CAF50' : '#F44336'},
                    ]}>
                    {session.profit >= 0 ? '+' : ''}￥
                    {session.profit.toLocaleString()}
                  </Text>
                  <Icon name="chevron-right" size={24} color="#666" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
        availableLocations={availableLocations}
        availableGameTypes={availableGameTypes}
        availableStakes={availableStakes}
        availableTags={availableTags}
      />
      <OptionPanel
        visible={optionPanelVisible}
        top={optionPanelPos.top}
        right={optionPanelPos.right}
        onRequestClose={() => setOptionPanelVisible(false)}
        accordionSingleOpen={true}
        sessionTypeOptions={[
          {
            label: '全部',
            value: 'All',
            isSelected: filters.sessionType === 'All',
          },
          {
            label: '现金局',
            value: 'Cash Game',
            isSelected: filters.sessionType === 'Cash Game',
          },
          {
            label: '锦标赛',
            value: 'Tournament',
            isSelected: filters.sessionType === 'Tournament',
          },
        ]}
        bankrollOptions={[]}
        locationOptions={availableLocations.map(loc => ({
          label: loc,
          value: loc,
          isSelected: filters.location.includes(loc),
        }))}
        gameTypeOptions={availableGameTypes.map(gt => ({
          label: gt,
          value: gt,
          isSelected: filters.gameType.includes(gt),
        }))}
        stakesOptions={availableStakes.map(stake => ({
          label: stake,
          value: stake,
          isSelected: filters.stakes.includes(stake),
        }))}
        tagsOptions={availableTags.map(tag => ({
          label: tag,
          value: tag,
          isSelected: filters.tags.includes(tag),
        }))}
        onSessionTypeSelect={handleSessionTypeSelect}
        onBankrollSelect={() => {}}
        onLocationSelect={handleLocationSelect}
        onGameTypeSelect={handleGameTypeSelect}
        onStakesSelect={handleStakesSelect}
        onTagsSelect={handleTagsSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionsListContent: {
    paddingBottom: 80,
  },
  sessionItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    width: 40,
  },
  sessionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  sessionLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sessionGameInfo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionsScreen;
