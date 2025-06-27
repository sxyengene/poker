import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSessions} from '../hooks/useSessions';

const SessionsScreen = () => {
  const {sessions, loading, error, deleteSession, refresh} = useSessions();

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

  const handleRefresh = () => {
    refresh();
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
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
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
          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
            <Icon name="refresh" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
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
