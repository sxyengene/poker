import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface FilterOption {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  isSelected?: boolean;
  showArrow?: boolean;
}

interface FilterOptionListProps {
  options: FilterOption[];
  onSelect: (value: string) => void;
  style?: any;
  showDivider?: boolean;
  showArrow?: boolean;
}

const FilterOptionList: React.FC<FilterOptionListProps> = ({
  options,
  onSelect,
  style,
  showDivider = true,
  showArrow = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            index === options.length - 1 && styles.optionLast,
            option.isSelected && styles.selectedOption,
          ]}
          onPress={() => onSelect(option.value)}>
          <View style={styles.optionContent}>
            <View style={styles.optionLeft}>
              {option.icon && (
                <Icon
                  name={option.icon}
                  size={20}
                  color={option.iconColor || '#374151'}
                  style={styles.optionIcon}
                />
              )}
              <Text
                style={[
                  styles.optionText,
                  option.isSelected && styles.selectedText,
                ]}>
                {option.label}
              </Text>
            </View>
            <View style={styles.optionRight}>
              {option.isSelected && (
                <Icon name="check" size={20} color="#6366F1" />
              )}
              {showArrow && (
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  option: {
    backgroundColor: 'transparent',
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
});

export default FilterOptionList;
