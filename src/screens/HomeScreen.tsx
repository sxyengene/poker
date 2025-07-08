import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSessions} from '../contexts/SessionsContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const {sessions, getStats} = useSessions();
  const stats = getStats();

  // 生成图表数据
  const generateChartData = () => {
    if (sessions.length === 0) {
      return {
        labels: ['无数据'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      };
    }

    // 按日期排序会话，计算累计盈利
    const sortedSessions = [...sessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    let cumulativeProfit = 0;
    const chartData = sortedSessions.slice(-6).map(session => {
      cumulativeProfit += session.profit;
      return {
        date: new Date(session.startTime).toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        }),
        profit: cumulativeProfit,
      };
    });

    return {
      labels: chartData.length > 0 ? chartData.map(d => d.date) : ['无数据'],
      datasets: [
        {
          data: chartData.length > 0 ? chartData.map(d => d.profit) : [0],
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const bankrollData = generateChartData();

  // 计算总游戏时长（小时）
  const totalHours = sessions.reduce((total, session) => {
    const duration = session.duration;
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return total + hours + minutes / 60;
    }
    return total;
  }, 0);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContent}>
        {/* 资金总览面板 */}
        <View style={styles.bankrollSection}>
          <View style={styles.centerContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>我的资金 </Text>
              <Icon name="info-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={styles.amountText}>
              ¥{stats.totalProfit.toLocaleString()}
            </Text>
            <View style={styles.changeRow}>
              <Icon
                name={stats.totalProfit >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={stats.totalProfit >= 0 ? '#22C55E' : '#F44336'}
              />
              <Text
                style={[
                  styles.changeText,
                  {color: stats.totalProfit >= 0 ? '#22C55E' : '#F44336'},
                ]}>
                总盈利 ¥{stats.totalProfit.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 关键数据卡片 */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>总盈利</Text>
            <Text style={styles.metricValue}>
              ¥{(stats.totalProfit / 10000).toFixed(1)}万
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>游戏时长</Text>
            <Text style={styles.metricValue}>{Math.round(totalHours)}小时</Text>
          </View>
        </View>

        {/* 折线图 */}
        <View style={styles.chartContainer}>
          <View style={styles.chartCard}>
            <LineChart
              data={bankrollData}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#22C55E',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* 说明性引导 */}
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>资金与数据</Text>
          <Text style={styles.guideText}>
            所有重要的玩家数据、资金记录和高级分析报告。
          </Text>
        </View>

        {/* 广告位横幅 */}
        <View style={styles.adContainer}>
          <LinearGradient
            colors={['#059669', '#047857']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.adGradient}>
            <View style={styles.adContent}>
              <View style={styles.adTextContainer}>
                <Text style={styles.adCategory}>冥想</Text>
                <Text style={styles.adTitle}>森林环境音</Text>
              </View>
              <View style={styles.adImage} />
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  bankrollSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  centerContainer: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  amountText: {
    color: '#1F2937',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  metricsContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    flexDirection: 'row',
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  metricLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  guideSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  guideTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guideText: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
  },
  adContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
  },
  adGradient: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  adContent: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTextContainer: {
    flex: 1,
  },
  adCategory: {
    color: 'white',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  adTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  adImage: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
});
