import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 模拟会话数据
const sessionData = [
  {
    id: '1',
    date: '2024-06-20',
    time: '18:30',
    location: 'Crown Casino',
    duration: '4h 30m',
    profit: 3000,
    buyin: 1000,
    cashout: 4000,
    blinds: '2/5',
    gameType: "NL Hold'em",
  },
  {
    id: '2',
    date: '2024-06-18',
    time: '20:00',
    location: 'Star City',
    duration: '6h 15m',
    profit: 1200,
    buyin: 800,
    cashout: 2000,
    blinds: '1/3',
    gameType: "NL Hold'em",
  },
  {
    id: '3',
    date: '2024-06-15',
    time: '19:45',
    location: 'Private Game',
    duration: '3h 20m',
    profit: -500,
    buyin: 500,
    cashout: 0,
    blinds: '1/2',
    gameType: "NL Hold'em",
  },
  {
    id: '4',
    date: '2024-06-12',
    time: '21:15',
    location: 'Crown Casino',
    duration: '5h 45m',
    profit: 800,
    buyin: 600,
    cashout: 1400,
    blinds: '2/5',
    gameType: "NL Hold'em",
  },
  {
    id: '5',
    date: '2024-06-10',
    time: '17:30',
    location: 'Online',
    duration: '2h 30m',
    profit: -200,
    buyin: 300,
    cashout: 100,
    blinds: '0.5/1',
    gameType: "NL Hold'em",
  },
];

const SessionsScreen = () => {
  const sessions = [
    {id: 1, profit: 3000, date: '2024-01-15', location: 'Wynn Las Vegas'},
    {id: 2, profit: -500, date: '2024-01-10', location: 'Bellagio'},
    {id: 3, profit: 800, date: '2024-01-08', location: 'Aria'},
    {id: 4, profit: 1200, date: '2024-01-05', location: 'MGM Grand'},
    {id: 5, profit: -300, date: '2024-01-03', location: 'Caesars Palace'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>All Sessions</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="account-balance-wallet" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="tune" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 会话列表 */}
      <ScrollView
        style={styles.sessionsList}
        contentContainerStyle={styles.sessionsListContent}
        showsVerticalScrollIndicator={false}>
        {sessions.map(session => (
          <TouchableOpacity key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionContent}>
              <Text style={styles.sessionId}>{session.id}</Text>
              <View style={styles.sessionDetails}>
                <Text style={styles.sessionLocation}>{session.location}</Text>
                <Text style={styles.sessionDate}>{session.date}</Text>
              </View>
              <View style={styles.profitContainer}>
                <Text
                  style={[
                    styles.profitText,
                    {color: session.profit >= 0 ? '#4CAF50' : '#F44336'},
                  ]}>
                  {session.profit >= 0 ? '+' : ''}$
                  {session.profit.toLocaleString()}
                </Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
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
});

export default SessionsScreen;
