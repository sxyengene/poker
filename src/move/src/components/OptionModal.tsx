import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface OptionItem {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  isSpecial?: boolean; // 用于标识特殊选项，如 "Add New Location"
}

interface OptionModalProps {
  visible: boolean;
  options: OptionItem[];
  onSelect: (value: string) => void;
  onClose: () => void;
  title?: string;
  position?: 'bottom' | 'center' | 'relative' | 'dropdown'; // 添加下拉菜单模式
  bottomOffset?: number; // 底部偏移量
  relativeToBottom?: number; // 相对于底部的距离（用于相对定位）
  marginFromTarget?: number; // 距离目标组件的间距
  showTitle?: boolean; // 是否显示标题
  customWidth?: number; // 自定义宽度
  triggerRef?: React.RefObject<any>; // 触发元素的引用
}

const OptionModal: React.FC<OptionModalProps> = ({
  visible,
  options,
  onSelect,
  onClose,
  title,
  position = 'bottom',
  bottomOffset = 20,
  relativeToBottom,
  marginFromTarget = 15,
  showTitle = true,
  customWidth,
  triggerRef,
}) => {
  const handleSelect = (value: string) => {
    onSelect(value);
  };

  // 计算样式
  let overlayStyle;
  let containerStyle;
  let contentStyle;

  if (position === 'center') {
    overlayStyle = [styles.overlay, styles.centerOverlay];
    containerStyle = [styles.container, styles.centerContainer];
    contentStyle = customWidth
      ? [styles.content, {width: customWidth}]
      : styles.content;
  } else if (position === 'dropdown') {
    // 下拉菜单模式：在右侧合适位置显示
    overlayStyle = [styles.overlay, styles.dropdownOverlay];
    containerStyle = [styles.container, styles.dropdownContainer];
    contentStyle = customWidth
      ? [styles.content, styles.dropdownContent, {width: customWidth}]
      : [styles.content, styles.dropdownContent];
  } else if (position === 'relative' && relativeToBottom !== undefined) {
    // 相对定位：距离底部指定距离
    const calculatedOffset = relativeToBottom + marginFromTarget;
    overlayStyle = [styles.overlay, {paddingBottom: calculatedOffset}];
    containerStyle = styles.container;
    contentStyle = customWidth
      ? [styles.content, {width: customWidth}]
      : styles.content;
  } else {
    // 默认底部定位
    overlayStyle = [styles.overlay, {paddingBottom: bottomOffset}];
    containerStyle = styles.container;
    contentStyle = customWidth
      ? [styles.content, {width: customWidth}]
      : styles.content;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={overlayStyle} onPress={onClose}>
        <View style={containerStyle}>
          {showTitle && title && <Text style={styles.title}>{title}</Text>}
          <View style={contentStyle}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  index === options.length - 1 && styles.optionLast,
                ]}
                onPress={() => handleSelect(option.value)}>
                <Text
                  style={[
                    styles.optionText,
                    option.isSpecial && styles.specialText,
                  ]}>
                  {option.label}
                </Text>
                {option.icon && (
                  <View style={styles.optionIcon}>
                    <Icon
                      name={option.icon}
                      size={20}
                      color={option.iconColor || '#374151'}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  centerOverlay: {
    justifyContent: 'center',
    paddingBottom: 0,
  },
  dropdownOverlay: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '25%', // 向上调整位置
    paddingBottom: 0,
  },
  container: {
    marginHorizontal: 40,
  },
  centerContainer: {
    marginHorizontal: 20,
    maxWidth: 300,
    alignSelf: 'center',
  },
  dropdownContainer: {
    marginLeft: 60,
    marginRight: 20,
    maxWidth: 280,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  dropdownContent: {
    minWidth: 180,
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginBottom: 0,
    minHeight: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default OptionModal;
