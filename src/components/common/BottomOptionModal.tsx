import React from 'react';
import BottomSheetModal from './BottomSheetModal';
import OptionList, {OptionItem} from './OptionList';

interface BottomOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  title?: string;
  options: OptionItem[];
  multiSelect?: boolean;
}

const BottomOptionModal: React.FC<BottomOptionModalProps> = ({
  visible,
  onClose,
  onSelect,
  title,
  options,
  multiSelect = false,
}) => {
  const handleSelect = (value: string) => {
    onSelect(value);
    if (!multiSelect) {
      onClose(); // 单选时自动关闭
    }
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={title}
      height="50%">
      <OptionList
        options={options}
        onSelect={handleSelect}
        multiSelect={multiSelect}
        style={{marginHorizontal: 20, marginTop: 10}}
      />
    </BottomSheetModal>
  );
};

export default BottomOptionModal;
