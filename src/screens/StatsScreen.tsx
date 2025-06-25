import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  // 时间筛选器选项
  const periodOptions = ['All', '1M', '3M', '6M', '1Y', 'YTD'];

  // Player Profit 数据
  const playerProfitData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        data: [0, 3000, 7000, 12000, 16000, 20000],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // 蓝色
        strokeWidth: 3,
      },
    ],
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    // 这里可以根据选择的时间段更新数据
  };

  const handleChartLongPress = () => {
    Alert.alert(
      '图表详细信息',
      'Tap and hold charts for more info.\n\n当前收益: US$3,000\n时间范围: ' +
        selectedPeriod,
      [{text: '确定', style: 'default'}],
    );
  };

  const handleHealthDataAccess = () => {
    Alert.alert(
      'Health Data Access',
      'Allow access to health data from iOS Settings to track mindfulness and wellness during gaming sessions.',
      [
        {text: '取消', style: 'cancel'},
        {text: '前往设置', style: 'default'},
      ],
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
          <Text style={styles.title}>数据指标</Text>
        </View>

        {/* 提示卡片 */}
        <View style={styles.tipCard}>
          <Icon name="lightbulb-outline" size={20} color="#F59E0B" />
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipText}>
              在这里追踪您的表现。{'\n'}
              长按图表获取更多信息。
            </Text>
          </View>
        </View>

        {/* Player Profit 卡片 */}
        <View style={styles.profitCard}>
          <View style={styles.profitHeader}>
            <View style={styles.profitTitleContainer}>
              <Text style={styles.profitTitle}>玩家盈利</Text>
              <TouchableOpacity style={styles.allButton}>
                <Icon name="open-in-full" size={16} color="#6B7280" />
                <Text style={styles.allButtonText}>全部</Text>
                <Icon name="chevron-right" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profitAmount}>¥20,000</Text>
          </View>

          {/* 折线图 */}
          <TouchableOpacity
            style={styles.chartArea}
            onLongPress={handleChartLongPress}
            activeOpacity={0.8}>
            <LineChart
              data={playerProfitData}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '0',
                  strokeWidth: '0',
                },
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: '#E5E7EB',
                  strokeDasharray: '5,5',
                },
              }}
              bezier
              style={styles.chart}
            />
            {/* 右侧Y轴标签 */}
            <View style={styles.yAxisLabels}>
              <Text style={styles.yAxisLabel}>¥2万</Text>
              <Text style={styles.yAxisLabel}>¥1.5万</Text>
              <Text style={styles.yAxisLabel}>¥1万</Text>
              <Text style={styles.yAxisLabel}>¥0</Text>
            </View>
          </TouchableOpacity>

          {/* 时间筛选器 */}
          <View style={styles.periodSelector}>
            {periodOptions.map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodSelect(period)}>
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.expandButton}>
              <Icon name="open-in-full" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 健康数据访问提示 */}
        <TouchableOpacity
          style={styles.healthCard}
          onPress={handleHealthDataAccess}>
          <View style={styles.healthIcon}>
            <Icon name="favorite" size={20} color="#10B981" />
          </View>
          <View style={styles.healthTextContainer}>
            <Text style={styles.healthTitle}>允许访问健康数据</Text>
            <Text style={styles.healthSubtitle}>
              在iOS设置中开启以追踪正念状态
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color="#6B7280" />
        </TouchableOpacity>
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
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 32,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  profitCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 32,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profitHeader: {
    marginBottom: 20,
  },
  profitTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  allButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  allButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  profitAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  chartArea: {
    position: 'relative',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  yAxisLabels: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 200,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#000000',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  expandButton: {
    padding: 8,
  },
  healthCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 32,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  healthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  healthTextContainer: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  healthSubtitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
});
