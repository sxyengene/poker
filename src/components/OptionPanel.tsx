import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OptionList, {OptionItem} from './common/OptionList';

interface OptionPanelProps {
  visible: boolean;
  top: number;
  right: number;
  onRequestClose: () => void;
  accordionSingleOpen?: boolean;
  sessionTypeOptions: OptionItem[];
  bankrollOptions: OptionItem[];
  locationOptions: OptionItem[];
  gameTypeOptions: OptionItem[];
  stakesOptions: OptionItem[];
  tagsOptions: OptionItem[];
  onSessionTypeSelect: (value: string) => void;
  onBankrollSelect: (value: string) => void;
  onLocationSelect: (value: string) => void;
  onGameTypeSelect: (value: string) => void;
  onStakesSelect: (value: string) => void;
  onTagsSelect: (value: string) => void;
}

interface AccordionItem {
  key: string;
  title: string;
  icon: string;
  options: OptionItem[];
  onSelect: (value: string) => void;
}

const OptionPanel: React.FC<OptionPanelProps> = ({
  visible,
  top,
  right,
  onRequestClose,
  accordionSingleOpen = true,
  sessionTypeOptions,
  bankrollOptions,
  locationOptions,
  gameTypeOptions,
  stakesOptions,
  tagsOptions,
  onSessionTypeSelect,
  onBankrollSelect,
  onLocationSelect,
  onGameTypeSelect,
  onStakesSelect,
  onTagsSelect,
}) => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const panelRef = useRef<View>(null);

  useEffect(() => {
    if (!visible) setOpenKey(null);
  }, [visible]);

  if (!visible) return null;

  const handleAccordionToggle = (key: string) => {
    if (accordionSingleOpen) {
      setOpenKey(prev => (prev === key ? null : key));
    } else {
      setOpenKey(prev => (prev === key ? null : key));
    }
  };

  // 点击panel外部关闭
  const handlePressOutside = (e: any) => {
    if (panelRef.current) {
      onRequestClose();
    }
  };

  const accordionData: AccordionItem[] = [
    {
      key: 'sessionType',
      title: 'Session Type',
      icon: 'casino',
      options: sessionTypeOptions,
      onSelect: onSessionTypeSelect,
    },
    {
      key: 'bankroll',
      title: 'Bankroll',
      icon: 'account-balance-wallet',
      options: bankrollOptions,
      onSelect: onBankrollSelect,
    },
    {
      key: 'location',
      title: 'Location',
      icon: 'location-on',
      options: locationOptions,
      onSelect: onLocationSelect,
    },
    {
      key: 'gameType',
      title: 'Game Type',
      icon: 'extension',
      options: gameTypeOptions,
      onSelect: onGameTypeSelect,
    },
    {
      key: 'stakes',
      title: 'Stakes',
      icon: 'attach-money',
      options: stakesOptions,
      onSelect: onStakesSelect,
    },
    {
      key: 'tags',
      title: 'Tags',
      icon: 'local-offer',
      options: tagsOptions,
      onSelect: onTagsSelect,
    },
  ];

  return (
    <Pressable style={styles.overlay} onPress={handlePressOutside}>
      <View
        ref={panelRef}
        style={[styles.panel, {top, right}]}
        onStartShouldSetResponder={() => true}
        onTouchEnd={e => e.stopPropagation()}>
        {/* 显示模式（无title） */}
        <OptionList
          options={[
            {label: 'Standard', value: 'Standard', isSelected: true},
            {label: 'Compact', value: 'Compact', isSelected: false},
          ]}
          onSelect={() => {}}
          style={{marginBottom: 8}}
        />
        {/* 分组抽屉 */}
        {accordionData.map(item => (
          <View key={item.key}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => handleAccordionToggle(item.key)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.accordionTitle}>{item.title}</Text>
                <Icon
                  name={item.icon}
                  size={20}
                  color="#222"
                  style={{marginLeft: 8}}
                />
              </View>
              <Icon
                name={openKey === item.key ? 'expand-less' : 'chevron-right'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
            {openKey === item.key && (
              <View style={styles.accordionContent}>
                <OptionList options={item.options} onSelect={item.onSelect} />
              </View>
            )}
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  panel: {
    position: 'absolute',
    minWidth: 240,
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    paddingVertical: 8,
    paddingHorizontal: 0,
    zIndex: 100,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  accordionTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  accordionContent: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export default OptionPanel;
