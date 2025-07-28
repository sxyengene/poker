import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OptionList, {OptionItem} from './common/OptionList';

export interface FilterOptions {
  sessionType: 'All' | 'Cash Game' | 'Tournament';
  location: string[];
  gameType: string[];
  stakes: string[];
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  availableLocations: string[];
  availableGameTypes: string[];
  availableStakes: string[];
  availableTags: string[];
}

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH * 0.6;

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
  availableLocations,
  availableGameTypes,
  availableStakes,
  availableTags,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [viewMode, setViewMode] = useState<'Standard' | 'Compact'>('Compact');

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      sessionType: 'All',
      location: [],
      gameType: [],
      stakes: [],
      tags: [],
      dateRange: {start: null, end: null},
    };
    setFilters(defaultFilters);
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  // 视图模式选项
  const viewModeOptions: OptionItem[] = [
    {
      label: 'Standard',
      value: 'Standard',
      isSelected: viewMode === 'Standard',
    },
    {
      label: 'Compact',
      value: 'Compact',
      isSelected: viewMode === 'Compact',
    },
  ];

  // 这里为后续分组 OptionList 预留结构
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.panelContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Sessions</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {/* 视图模式分组 */}
          <Text style={styles.groupTitle}>显示模式</Text>
          <OptionList
            options={viewModeOptions}
            onSelect={v => setViewMode(v as 'Standard' | 'Compact')}
            style={{marginBottom: 12}}
          />

          {/* 这里可以继续添加分组，比如 Session Type、Bankroll、Location 等 */}
          <Text style={styles.groupTitle}>筛选条件</Text>
          {/* Session Type */}
          <OptionList
            options={[
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
            onSelect={v => setFilters(f => ({...f, sessionType: v as any}))}
            style={{marginBottom: 8}}
          />
          {/* Bankroll（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />
          {/* Location（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />
          {/* Game Type（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />
          {/* Stakes（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />
          {/* Tags（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />
          {/* Date Range（预留，暂不实现） */}
          <OptionList
            options={[]}
            onSelect={() => {}}
            style={{marginBottom: 8}}
          />

          {/* 清除筛选按钮 */}
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="clear" size={20} color="#EF4444" />
              <Text style={styles.clearButtonText}>清除筛选</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    width: PANEL_WIDTH,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
    paddingTop: 24,
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  groupTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 6,
    marginLeft: 20,
  },
  clearButton: {
    marginTop: 24,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FilterModal;
