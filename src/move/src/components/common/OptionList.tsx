import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface OptionItem {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  isSelected?: boolean;
  isSpecial?: boolean;
}

interface OptionListProps {
  options: OptionItem[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  style?: any;
}

const OptionList: React.FC<OptionListProps> = ({
  options,
  onSelect,
  multiSelect = false,
  style,
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
            <Text
              style={[
                styles.optionText,
                option.isSpecial && styles.specialText,
                option.isSelected && styles.selectedText,
              ]}>
              {option.label}
            </Text>
            <View style={styles.optionRight}>
              {option.icon && (
                <Icon
                  name={option.icon}
                  size={20}
                  color={option.iconColor || '#374151'}
                  style={styles.optionIcon}
                />
              )}
              {option.isSelected && (
                <Icon
                  name="check"
                  size={20}
                  color="#6366F1"
                  style={styles.checkIcon}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
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
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  specialText: {
    color: '#6366F1',
    fontWeight: '600',
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
  optionIcon: {
    marginLeft: 8,
  },
  checkIcon: {
    marginLeft: 4,
  },
});

export default OptionList;
