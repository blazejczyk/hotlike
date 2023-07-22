import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextProps } from 'react-native';
import { IndexPath, Select, SelectItem, Text, useTheme } from '@ui-kitten/components';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type TSettingsDropdownOption<TValue> = {
  value: TValue;
  text: string;
  icon?: JSX.Element;
};

type TSettingsDropdownProps<TValue> = {
  options: TSettingsDropdownOption<TValue>[];
  label: string;
  style?: StyleProp<ViewStyle>;
} & (
  {
    multiple?: false;
    value: TValue;
    onChange: (nextValue: TValue) => void;
    minValuesNumber?: 1; // this actually doesn't matter (it's only added for the consistency reason)
    maxValuesNumber?: 1; // this actually doesn't matter (it's only added for the consistency reason)
  } |
  {
    multiple: true;
    value: TValue[];
    onChange: (nextValue: TValue[]) => void;
    minValuesNumber?: number;
    maxValuesNumber?: number;
  }
);

export default function SettingsDropdown<TValue>({
 multiple, options, value, label, onChange, style, minValuesNumber, maxValuesNumber,
}: TSettingsDropdownProps<TValue>): JSX.Element {
  const theme = useTheme();
  const values = useMemo(() => Array.isArray(value) ? value : [value], [value]);

  const optionsIndexes = useMemo(() => options.reduce<Map<TValue, number>>((result, option, idx) => {
    result.set(option.value, idx);
    return result;
  }, new Map()), [options]);

  const [selectedIndex, setSelectedIndex] = useState<IndexPath[]>(values.map((v) => new IndexPath(optionsIndexes.get(v) as number)));

  useEffect(() => {
    setSelectedIndex(values.map((v) => new IndexPath(optionsIndexes.get(v) as number)));
  }, [optionsIndexes, values]);

  const handleSelect = useCallback((index: IndexPath | IndexPath[]) => {
    const nextIndex = Array.isArray(index) ? index : [index];
    if ((nextIndex.length < (minValuesNumber === undefined ? 1 : minValuesNumber)) || (maxValuesNumber !== undefined && nextIndex.length > maxValuesNumber)) {
      return;
    }
    setSelectedIndex(nextIndex);
    const nextValues = nextIndex.map((indexPath) => options[indexPath.row].value);
    if (multiple) {
      onChange(nextValues);
    } else {
      onChange(nextValues[0]);
    }
  }, [options, multiple, onChange, minValuesNumber, maxValuesNumber]);

  const renderValues = useCallback((props: TextProps) => {
    return (
      <View style={[props.style, styles.values]}>
        {selectedIndex.map((selectedIndexPath) => {
          const option = options[selectedIndexPath.row];
          const valueStyle = multiple ? [styles.value, { backgroundColor: theme['color-basic-400'] }] : undefined;
          return (
            <View key={selectedIndexPath.row} style={valueStyle}>
              {option.icon && option.icon}
              <Text>{option.text}</Text>
            </View>
          );
        })}
      </View>
    );
  }, [options, multiple, selectedIndex, theme]);

  const commonStyle = useMemo(() => [styles.select, style || {}], [style]);

  const mappedOptions = useMemo(() => options.map(({ value, text, icon }) => ({
    value,
    text,
    renderIcon: icon && (() => icon),
  })), [options]);

  return (
    <Select
      multiSelect={multiple}
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      value={renderValues as () => JSX.Element}
      label={label}
      style={commonStyle}
    >
      {mappedOptions.map(({ value, text, renderIcon }, idx) => <SelectItem key={idx} title={text} accessoryLeft={renderIcon} />)}
    </Select>
  );
}

const styles = StyleSheet.create({
  select: {
    marginBottom: 10,
  },
  values: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 3,
  },
});
