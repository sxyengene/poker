import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import OptionModal from './OptionModal';

// 类型定义
export type SessionType = {
  session: 'Cash Game' | 'Tournament' | '';
  location: string;
  game: string;
  stakes: string;
  isTournament: boolean;
};

export interface Session {
  sessionType: SessionType;
  startTime: Date;
  endTime: Date;
  buyIn: number;
  cashOut: number;
  rebuys: number;
  tableExpenses: number;
  notes?: string;
  tags?: string[];
}

export type GameType =
  | 'NL Texas Hold Em'
  | 'Pot Limit Omaha'
  | 'Razz'
  | 'Mixed'
  | 'Tournament'
  | string;

export type StakesType = '1/2' | '1/3' | '2/5' | '5/10' | string;

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (session: Session) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // 状态管理
  const [sessionData, setSessionData] = useState<Session>({
    sessionType: {
      session: 'Cash Game',
      location: '',
      game: '',
      stakes: '',
      isTournament: false,
    },
    startTime: new Date(),
    endTime: new Date(),
    buyIn: 0,
    cashOut: 0,
    rebuys: 0,
    tableExpenses: 0,
    notes: '',
    tags: [],
  });

  // 选择器显示状态
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [showStakesPicker, setShowStakesPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // 自定义输入状态
  const [customLocation, setCustomLocation] = useState('');
  const [customGame, setCustomGame] = useState('');
  const [customStakes, setCustomStakes] = useState('');
  const [tagInput, setTagInput] = useState('');

  // 预设选项配置
  const sessionOptionsData = [
    {label: '请选择', value: '请选择'},
    {label: 'Cash Game', value: 'Cash Game'},
    {label: 'Tournament', value: 'Tournament'},
  ];

  const locationOptionsData = [
    {label: '请选择', value: '请选择'},
    {label: 'Home Game', value: 'Home Game'},
    {label: 'Casino', value: 'Casino'},
    {label: 'Online', value: 'Online'},
    {label: '添加新位置', value: 'Add New Location', isSpecial: true},
  ];

  const gameOptionsData = [
    {label: '请选择', value: '请选择'},
    {label: 'NL Texas Hold Em', value: 'NL Texas Hold Em'},
    {label: 'Pot Limit Omaha', value: 'Pot Limit Omaha'},
    {label: 'Razz', value: 'Razz'},
    {label: 'Mixed', value: 'Mixed'},
    {label: '添加新游戏', value: 'Add Game', isSpecial: true},
  ];

  const stakesOptionsData = [
    {label: '请选择', value: '请选择'},
    {label: '1/2', value: '1/2'},
    {label: '1/3', value: '1/3'},
    {label: '2/5', value: '2/5'},
    {label: '5/10', value: '5/10'},
    {label: '自定义', value: 'Custom', isSpecial: true},
  ];

  const updateSessionData = (updates: Partial<Session>) => {
    setSessionData((prev: Session) => ({...prev, ...updates}));
  };

  const updateSessionType = (updates: Partial<SessionType>) => {
    setSessionData((prev: Session) => ({
      ...prev,
      sessionType: {...prev.sessionType, ...updates},
    }));
  };

  const handleSessionSelect = (session: string) => {
    const sessionValue =
      session === '请选择' ? '' : (session as 'Cash Game' | 'Tournament');
    updateSessionType({
      session: sessionValue,
      isTournament: sessionValue === 'Tournament',
    });
    setShowSessionPicker(false);
  };

  const handleLocationSelect = (location: string) => {
    if (location === 'Add New Location') {
      // 显示自定义输入
      Alert.prompt('添加新位置', '请输入位置名称', [
        {text: '取消', style: 'cancel'},
        {
          text: '确定',
          onPress: text => {
            if (text) {
              updateSessionType({location: text});
            }
          },
        },
      ]);
    } else if (location === '请选择') {
      updateSessionType({location: ''});
    } else {
      updateSessionType({location});
    }
    setShowLocationPicker(false);
  };

  const handleGameSelect = (game: string) => {
    if (game === 'Add Game') {
      Alert.prompt('添加新游戏', '请输入游戏类型', [
        {text: '取消', style: 'cancel'},
        {
          text: '确定',
          onPress: text => {
            if (text) {
              updateSessionType({game: text});
            }
          },
        },
      ]);
    } else if (game === '请选择') {
      updateSessionType({game: ''});
    } else {
      updateSessionType({game});
    }
    setShowGamePicker(false);
  };

  const handleStakesSelect = (stakes: string) => {
    if (stakes === 'Custom') {
      Alert.prompt('自定义注额', '请输入注额', [
        {text: '取消', style: 'cancel'},
        {
          text: '确定',
          onPress: text => {
            if (text) {
              updateSessionType({stakes: text});
            }
          },
        },
      ]);
    } else if (stakes === '请选择') {
      updateSessionType({stakes: ''});
    } else {
      updateSessionType({stakes});
    }
    setShowStakesPicker(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !sessionData.tags?.includes(tagInput.trim())) {
      updateSessionData({
        tags: [...(sessionData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateSessionData({
      tags:
        sessionData.tags?.filter((tag: string) => tag !== tagToRemove) || [],
    });
  };

  const handleSave = () => {
    // 验证必填字段
    if (
      !sessionData.sessionType.session ||
      !sessionData.sessionType.location ||
      !sessionData.sessionType.game ||
      !sessionData.sessionType.stakes
    ) {
      Alert.alert('错误', '请填写所有必填字段');
      return;
    }

    onSave(sessionData);
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.dragIndicator} />
          <Text style={styles.title}>New Session</Text>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {/* Session */}
            <View style={styles.formRow}>
              <Icon
                name="person"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>Session</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowSessionPicker(true)}>
                  <Text
                    style={[
                      styles.selectText,
                      sessionData.sessionType.session
                        ? styles.selectedText
                        : null,
                    ]}>
                    {sessionData.sessionType.session || 'Please select'}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Location */}
            <View style={styles.formRow}>
              <Icon
                name="location-on"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>Location</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowLocationPicker(true)}>
                  <Text
                    style={[
                      styles.selectText,
                      sessionData.sessionType.location
                        ? styles.selectedText
                        : null,
                    ]}>
                    {sessionData.sessionType.location || 'Please select'}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Game */}
            <View style={styles.formRow}>
              <Icon
                name="casino"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>Game</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowGamePicker(true)}>
                  <Text
                    style={[
                      styles.selectText,
                      sessionData.sessionType.game ? styles.selectedText : null,
                    ]}>
                    {sessionData.sessionType.game || 'Please select'}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stakes */}
            <View style={styles.formRow}>
              <Icon
                name="attach-money"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>Stakes</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowStakesPicker(true)}>
                  <Text
                    style={[
                      styles.selectText,
                      sessionData.sessionType.stakes
                        ? styles.selectedText
                        : null,
                    ]}>
                    {sessionData.sessionType.stakes || 'Please select'}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Start */}
            <View style={styles.formRow}>
              <Icon
                name="schedule"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>Start</Text>
                <View style={styles.dateTimeRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}>
                    <Text style={styles.dateText}>
                      {formatDateTime(sessionData.startTime)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowStartTimePicker(true)}>
                    <Text style={styles.dateText}>
                      {formatTime(sessionData.startTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* End */}
            <View style={styles.formRow}>
              <Icon
                name="schedule"
                size={24}
                color="#9CA3AF"
                style={styles.formIcon}
              />
              <View style={styles.formContent}>
                <Text style={styles.formLabel}>End</Text>
                <View style={styles.dateTimeRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}>
                    <Text style={styles.dateText}>
                      {formatDateTime(sessionData.endTime)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowEndTimePicker(true)}>
                    <Text style={styles.dateText}>
                      {formatTime(sessionData.endTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Buy In & Cash Out */}
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputTitle}>Buy In</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$0"
                  keyboardType="numeric"
                  value={
                    sessionData.buyIn > 0 ? sessionData.buyIn.toString() : ''
                  }
                  onChangeText={text =>
                    updateSessionData({buyIn: Number(text) || 0})
                  }
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputTitle}>Cash Out</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$0"
                  keyboardType="numeric"
                  value={
                    sessionData.cashOut > 0
                      ? sessionData.cashOut.toString()
                      : ''
                  }
                  onChangeText={text =>
                    updateSessionData({cashOut: Number(text) || 0})
                  }
                />
              </View>
            </View>

            {/* Rebuys / Top Offs */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Rebuys / Top Offs</Text>
              <TextInput
                style={styles.fullWidthInput}
                placeholder="$0"
                keyboardType="numeric"
                value={
                  sessionData.rebuys > 0 ? sessionData.rebuys.toString() : ''
                }
                onChangeText={text =>
                  updateSessionData({rebuys: Number(text) || 0})
                }
              />
            </View>

            {/* Table Expenses */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Table Expenses (Rake, tips)</Text>
              <TextInput
                style={styles.fullWidthInput}
                placeholder="$0"
                keyboardType="numeric"
                value={
                  sessionData.tableExpenses > 0
                    ? sessionData.tableExpenses.toString()
                    : ''
                }
                onChangeText={text =>
                  updateSessionData({tableExpenses: Number(text) || 0})
                }
              />
            </View>

            {/* Notes */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Notes (Optional)</Text>
              <TextInput
                style={[styles.fullWidthInput, styles.notesInput]}
                placeholder="Add notes..."
                multiline
                numberOfLines={4}
                value={sessionData.notes}
                onChangeText={text => updateSessionData({notes: text})}
              />
            </View>

            {/* Tags */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Tags (Optional)</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tagsDisplay}>
                  {sessionData.tags?.map((tag: string, index: number) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(tag)}>
                        <Icon name="close" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Add tag"
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={addTag}
                  />
                  <TouchableOpacity
                    style={styles.addTagButton}
                    onPress={addTag}>
                    <Icon name="add" size={20} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Date Time Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={sessionData.startTime}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  updateSessionData({startTime: selectedDate});
                }
              }}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={sessionData.startTime}
              mode="time"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowStartTimePicker(false);
                if (selectedDate) {
                  updateSessionData({startTime: selectedDate});
                }
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={sessionData.endTime}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  updateSessionData({endTime: selectedDate});
                }
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={sessionData.endTime}
              mode="time"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowEndTimePicker(false);
                if (selectedDate) {
                  updateSessionData({endTime: selectedDate});
                }
              }}
            />
          )}

          {/* Option Modals */}
          <OptionModal
            visible={showSessionPicker}
            options={sessionOptionsData}
            onSelect={handleSessionSelect}
            onClose={() => setShowSessionPicker(false)}
            position="dropdown"
            showTitle={false}
          />

          <OptionModal
            visible={showLocationPicker}
            options={locationOptionsData}
            onSelect={handleLocationSelect}
            onClose={() => setShowLocationPicker(false)}
            position="dropdown"
            showTitle={false}
            customWidth={280} // 增加宽度避免文字换行
          />

          <OptionModal
            visible={showGamePicker}
            options={gameOptionsData}
            onSelect={handleGameSelect}
            onClose={() => setShowGamePicker(false)}
            position="dropdown"
            showTitle={false}
          />

          <OptionModal
            visible={showStakesPicker}
            options={stakesOptionsData}
            onSelect={handleStakesSelect}
            onClose={() => setShowStakesPicker(false)}
            position="dropdown"
            showTitle={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 4,
  },
  formIcon: {
    marginRight: 16,
    width: 24,
  },
  formContent: {
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  selectedText: {
    color: '#000000',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    fontSize: 16,
    color: '#000000',
  },
  fullWidthInputContainer: {
    marginBottom: 16,
  },
  fullWidthInput: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    fontSize: 16,
    color: '#000000',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tagsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  tagsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 16,
    color: '#000000',
  },
  addTagButton: {
    padding: 8,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 16,
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default AddSessionModal;
