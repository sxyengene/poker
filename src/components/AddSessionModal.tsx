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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import OptionModal from './OptionModal';
import {
  SessionType,
  NewSession,
  GameType,
  StakesType,
  CurrencyType,
} from '../types/session';

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (session: NewSession) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // 货币单位状态
  const [currency, setCurrency] = useState<CurrencyType>('￥');

  // 状态管理
  const [sessionData, setSessionData] = useState<NewSession>(() => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 默认5小时后结束

    return {
      sessionType: {
        session: '',
        location: '',
        game: '',
        stakes: '',
        isTournament: false,
      },
      startTime: now,
      endTime: endTime,
      buyIn: 0,
      cashOut: 0,
      rebuys: 0,
      tableExpenses: 0,
      notes: '',
      tags: [],
    };
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
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // 日期选择器临时状态
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // 错误状态管理
  const [fieldErrors, setFieldErrors] = useState<{
    session: boolean;
    location: boolean;
    game: boolean;
    stakes: boolean;
    buyIn: boolean;
  }>({
    session: false,
    location: false,
    game: false,
    stakes: false,
    buyIn: false,
  });

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

  const currencyOptionsData = [
    {label: '人民币 ￥', value: '￥'},
    {label: '美元 $', value: '$'},
  ];

  // 切换货币单位
  const toggleCurrency = () => {
    setShowCurrencyPicker(true);
  };

  const handleCurrencySelect = (newCurrency: string) => {
    setCurrency(newCurrency as CurrencyType);
    setShowCurrencyPicker(false);
  };

  // 清除字段错误状态
  const clearFieldError = (field: keyof typeof fieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({...prev, [field]: false}));
    }
  };

  // 验证必填字段并设置错误状态
  const validateRequiredFields = () => {
    const errors = {
      session: !sessionData.sessionType.session,
      location: !sessionData.sessionType.location,
      game: !sessionData.sessionType.game,
      stakes: !sessionData.sessionType.stakes,
      buyIn: !sessionData.buyIn || sessionData.buyIn <= 0,
    };

    setFieldErrors(errors);
    return !Object.values(errors).some(hasError => hasError);
  };

  const updateSessionData = (updates: Partial<NewSession>) => {
    setSessionData((prev: NewSession) => ({...prev, ...updates}));
  };

  const updateSessionType = (updates: Partial<SessionType>) => {
    setSessionData((prev: NewSession) => ({
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
    if (sessionValue) {
      clearFieldError('session');
    }
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
              clearFieldError('location');
            }
          },
        },
      ]);
    } else if (location === '请选择') {
      updateSessionType({location: ''});
    } else {
      updateSessionType({location});
      clearFieldError('location');
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
              clearFieldError('game');
            }
          },
        },
      ]);
    } else if (game === '请选择') {
      updateSessionType({game: ''});
    } else {
      updateSessionType({game});
      clearFieldError('game');
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
              clearFieldError('stakes');
            }
          },
        },
      ]);
    } else if (stakes === '请选择') {
      updateSessionType({stakes: ''});
    } else {
      updateSessionType({stakes});
      clearFieldError('stakes');
    }
    setShowStakesPicker(false);
  };

  // 改进的日期时间处理函数
  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    type: 'startDate' | 'startTime' | 'endDate' | 'endTime',
  ) => {
    if (Platform.OS === 'android') {
      // Android平台处理
      if (event.type === 'set' && selectedDate) {
        applyDateTimeChange(selectedDate, type);
      }
      closeDateTimePicker(type);
    } else {
      // iOS平台处理 - 实时更新临时状态
      if (event.type === 'set' && selectedDate) {
        if (type === 'startDate' || type === 'startTime') {
          setTempStartDate(selectedDate);
        } else {
          setTempEndDate(selectedDate);
        }
      }
    }
  };

  const applyDateTimeChange = (
    selectedDate: Date,
    type: 'startDate' | 'startTime' | 'endDate' | 'endTime',
  ) => {
    try {
      if (type === 'startDate') {
        const newDateTime = new Date(selectedDate);
        if (sessionData.startTime) {
          newDateTime.setHours(sessionData.startTime.getHours());
          newDateTime.setMinutes(sessionData.startTime.getMinutes());
        }
        newDateTime.setSeconds(0);
        newDateTime.setMilliseconds(0);
        updateSessionData({startTime: newDateTime});
      } else if (type === 'startTime') {
        const newDateTime = new Date(sessionData.startTime || new Date());
        newDateTime.setHours(selectedDate.getHours());
        newDateTime.setMinutes(selectedDate.getMinutes());
        newDateTime.setSeconds(0);
        newDateTime.setMilliseconds(0);
        updateSessionData({startTime: newDateTime});
      } else if (type === 'endDate') {
        const newDateTime = new Date(selectedDate);
        if (sessionData.endTime) {
          newDateTime.setHours(sessionData.endTime.getHours());
          newDateTime.setMinutes(sessionData.endTime.getMinutes());
        }
        newDateTime.setSeconds(0);
        newDateTime.setMilliseconds(0);
        updateSessionData({endTime: newDateTime});
      } else if (type === 'endTime') {
        const newDateTime = new Date(sessionData.endTime || new Date());
        newDateTime.setHours(selectedDate.getHours());
        newDateTime.setMinutes(selectedDate.getMinutes());
        newDateTime.setSeconds(0);
        newDateTime.setMilliseconds(0);
        updateSessionData({endTime: newDateTime});
      }
    } catch (error) {
      console.warn('Error updating date/time:', error);
    }
  };

  const closeDateTimePicker = (
    type: 'startDate' | 'startTime' | 'endDate' | 'endTime',
  ) => {
    switch (type) {
      case 'startDate':
        setShowStartDatePicker(false);
        break;
      case 'startTime':
        setShowStartTimePicker(false);
        break;
      case 'endDate':
        setShowEndDatePicker(false);
        break;
      case 'endTime':
        setShowEndTimePicker(false);
        break;
    }
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const confirmDateTimeChange = (
    type: 'startDate' | 'startTime' | 'endDate' | 'endTime',
  ) => {
    if (Platform.OS === 'ios') {
      const tempDate = type.includes('start') ? tempStartDate : tempEndDate;
      if (tempDate) {
        applyDateTimeChange(tempDate, type);
      }
    }
    closeDateTimePicker(type);
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
    if (!validateRequiredFields()) {
      // 不需要Alert，错误状态已经在UI中显示
      return;
    }

    onSave(sessionData);
    onClose();
  };

  // 重置表单和错误状态
  const resetForm = () => {
    setFieldErrors({
      session: false,
      location: false,
      game: false,
      stakes: false,
      buyIn: false,
    });
  };

  // 监听模态框打开状态，重置错误状态
  React.useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const formatDateTime = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Select Date';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Select Time';
    }
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
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            resetForm();
            onClose();
          }}
        />
        <View style={styles.container}>
          <View style={styles.dragIndicator} />

          {/* 标题栏 */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>New Session</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {/* Session */}
            <View
              style={[
                styles.compactFormRow,
                fieldErrors.session && styles.errorRow,
              ]}>
              <Icon
                name="person"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text
                style={[
                  styles.compactLabel,
                  fieldErrors.session && styles.errorLabel,
                ]}>
                Session
              </Text>
              <TouchableOpacity
                style={styles.compactSelectButton}
                onPress={() => setShowSessionPicker(true)}>
                <Text
                  style={[
                    styles.compactSelectText,
                    sessionData.sessionType.session
                      ? styles.selectedText
                      : null,
                    fieldErrors.session && styles.errorText,
                  ]}>
                  {sessionData.sessionType.session || 'Please select'}
                </Text>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {fieldErrors.session && (
                <Text style={styles.compactErrorMessage}>
                  请选择Session类型
                </Text>
              )}
            </View>

            {/* Location */}
            <View
              style={[
                styles.compactFormRow,
                fieldErrors.location && styles.errorRow,
              ]}>
              <Icon
                name="location-on"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text
                style={[
                  styles.compactLabel,
                  fieldErrors.location && styles.errorLabel,
                ]}>
                Location
              </Text>
              <TouchableOpacity
                style={styles.compactSelectButton}
                onPress={() => setShowLocationPicker(true)}>
                <Text
                  style={[
                    styles.compactSelectText,
                    sessionData.sessionType.location
                      ? styles.selectedText
                      : null,
                    fieldErrors.location && styles.errorText,
                  ]}>
                  {sessionData.sessionType.location || 'Please select'}
                </Text>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {fieldErrors.location && (
                <Text style={styles.compactErrorMessage}>请选择游戏位置</Text>
              )}
            </View>

            {/* Game */}
            <View
              style={[
                styles.compactFormRow,
                fieldErrors.game && styles.errorRow,
              ]}>
              <Icon
                name="casino"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text
                style={[
                  styles.compactLabel,
                  fieldErrors.game && styles.errorLabel,
                ]}>
                Game
              </Text>
              <TouchableOpacity
                style={styles.compactSelectButton}
                onPress={() => setShowGamePicker(true)}>
                <Text
                  style={[
                    styles.compactSelectText,
                    sessionData.sessionType.game ? styles.selectedText : null,
                    fieldErrors.game && styles.errorText,
                  ]}>
                  {sessionData.sessionType.game || 'Please select'}
                </Text>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {fieldErrors.game && (
                <Text style={styles.compactErrorMessage}>请选择游戏类型</Text>
              )}
            </View>

            {/* Stakes */}
            <View
              style={[
                styles.compactFormRow,
                fieldErrors.stakes && styles.errorRow,
              ]}>
              <Icon
                name="attach-money"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text
                style={[
                  styles.compactLabel,
                  fieldErrors.stakes && styles.errorLabel,
                ]}>
                Stakes
              </Text>
              <TouchableOpacity
                style={styles.compactSelectButton}
                onPress={() => setShowStakesPicker(true)}>
                <Text
                  style={[
                    styles.compactSelectText,
                    sessionData.sessionType.stakes ? styles.selectedText : null,
                    fieldErrors.stakes && styles.errorText,
                  ]}>
                  {sessionData.sessionType.stakes || 'Please select'}
                </Text>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {fieldErrors.stakes && (
                <Text style={styles.compactErrorMessage}>请选择游戏注额</Text>
              )}
            </View>

            {/* Start */}
            <View style={styles.compactFormRow}>
              <Icon
                name="schedule"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text style={styles.compactLabel}>Start</Text>
              <View style={styles.compactDateTimeRow}>
                <TouchableOpacity
                  style={styles.compactDateButton}
                  onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.compactDateText}>
                    {formatDateTime(sessionData.startTime)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compactTimeButton}
                  onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.compactDateText}>
                    {formatTime(sessionData.startTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* End */}
            <View style={styles.compactFormRow}>
              <Icon
                name="schedule"
                size={24}
                color="#9CA3AF"
                style={styles.compactIcon}
              />
              <Text style={styles.compactLabel}>End</Text>
              <View style={styles.compactDateTimeRow}>
                <TouchableOpacity
                  style={styles.compactDateButton}
                  onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.compactDateText}>
                    {formatDateTime(sessionData.endTime)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compactTimeButton}
                  onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.compactDateText}>
                    {formatTime(sessionData.endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buy In & Cash Out */}
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text
                  style={[
                    styles.inputTitle,
                    fieldErrors.buyIn && styles.errorLabel,
                  ]}>
                  Buy In
                </Text>
                <View
                  style={[
                    styles.currencyInputContainer,
                    fieldErrors.buyIn && styles.errorInputContainer,
                  ]}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={[
                      styles.currencyInput,
                      fieldErrors.buyIn && styles.errorInput,
                    ]}
                    placeholder="0"
                    keyboardType="numeric"
                    value={
                      sessionData.buyIn > 0 ? sessionData.buyIn.toString() : ''
                    }
                    onChangeText={text => {
                      const amount = Number(text) || 0;
                      updateSessionData({buyIn: amount});
                      if (amount > 0) {
                        clearFieldError('buyIn');
                      }
                    }}
                  />
                </View>
                {fieldErrors.buyIn && (
                  <Text style={styles.errorMessage}>请输入买入金额</Text>
                )}
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputTitle}>Cash Out</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="0"
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
            </View>

            {/* Rebuys / Top Offs */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Rebuys / Top Offs</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>{currency}</Text>
                <TextInput
                  style={styles.currencyInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={
                    sessionData.rebuys > 0 ? sessionData.rebuys.toString() : ''
                  }
                  onChangeText={text =>
                    updateSessionData({rebuys: Number(text) || 0})
                  }
                />
              </View>
            </View>

            {/* Table Expenses */}
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.inputTitle}>Table Expenses (Rake, tips)</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>{currency}</Text>
                <TextInput
                  style={styles.currencyInput}
                  placeholder="0"
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
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  onClose();
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Date Time Pickers - 改进的交互 */}
          {showStartDatePicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContainer}>
                {Platform.OS === 'ios' && (
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => closeDateTimePicker('startDate')}>
                      <Text style={styles.datePickerButtonText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>选择开始日期</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => confirmDateTimeChange('startDate')}>
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          styles.confirmText,
                        ]}>
                        确认
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={tempStartDate || sessionData.startTime || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) =>
                    handleDateTimeChange(event, selectedDate, 'startDate')
                  }
                />
              </View>
            </View>
          )}

          {showStartTimePicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContainer}>
                {Platform.OS === 'ios' && (
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => closeDateTimePicker('startTime')}>
                      <Text style={styles.datePickerButtonText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>选择开始时间</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => confirmDateTimeChange('startTime')}>
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          styles.confirmText,
                        ]}>
                        确认
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={tempStartDate || sessionData.startTime || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) =>
                    handleDateTimeChange(event, selectedDate, 'startTime')
                  }
                />
              </View>
            </View>
          )}

          {showEndDatePicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContainer}>
                {Platform.OS === 'ios' && (
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => closeDateTimePicker('endDate')}>
                      <Text style={styles.datePickerButtonText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>选择结束日期</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => confirmDateTimeChange('endDate')}>
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          styles.confirmText,
                        ]}>
                        确认
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={tempEndDate || sessionData.endTime || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) =>
                    handleDateTimeChange(event, selectedDate, 'endDate')
                  }
                />
              </View>
            </View>
          )}

          {showEndTimePicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContainer}>
                {Platform.OS === 'ios' && (
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => closeDateTimePicker('endTime')}>
                      <Text style={styles.datePickerButtonText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>选择结束时间</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => confirmDateTimeChange('endTime')}>
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          styles.confirmText,
                        ]}>
                        确认
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={tempEndDate || sessionData.endTime || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) =>
                    handleDateTimeChange(event, selectedDate, 'endTime')
                  }
                />
              </View>
            </View>
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
    gap: 8,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    minWidth: 20,
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
  },
  // 日期选择器相关样式
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  confirmText: {
    color: '#6366F1',
  },
  // 错误状态样式
  errorLabel: {
    color: '#EF4444',
  },
  errorSelectButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  errorText: {
    color: '#EF4444',
  },
  errorMessage: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  errorInputContainer: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorInput: {
    color: '#EF4444',
  },
  // 紧凑布局样式
  compactFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 2,
  },
  compactIcon: {
    width: 24,
    marginRight: 16,
  },
  compactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    minWidth: 80,
  },
  compactSelectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  compactSelectText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  compactErrorMessage: {
    position: 'absolute',
    bottom: -16,
    left: 120,
    fontSize: 12,
    color: '#EF4444',
  },
  errorRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginHorizontal: -8,
    marginVertical: 4,
    paddingHorizontal: 8,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  // 紧凑日期时间选择器样式
  compactDateTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compactDateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    minWidth: 100,
  },
  compactTimeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    minWidth: 60,
  },
  compactDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
});

export default AddSessionModal;
