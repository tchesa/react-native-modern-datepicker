import React, {useEffect, useReducer, useState } from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Calendar from './components/Calendar';
import SelectMonth from './components/SelectMonth';
import SelectTime from './components/SelectTime';
import Utils from './Utils';
import type {CalendarState, Configs, Mode} from './types';
import CalendarContext, { type CalendarContextType, defaultOptions } from './context/CalendarContext';

type ActionType = 'set' | 'toggleMonth' | 'toggleTime';

export type Action = {
  type: ActionType;
  selectedDate?: string;
  activeDate?: string;
};

const reducer = (state: CalendarState, action: Action): CalendarState => {
  switch (action.type) {
    case 'set':
      return {...state, ...action};
    case 'toggleMonth':
      return {...state, monthOpen: !state.monthOpen};
    case 'toggleTime':
      return {...state, timeOpen: !state.timeOpen};
    default:
      throw new Error('Unexpected action');
  }
};

export type Options = {
  backgroundColor: string;
  textHeaderColor: string;
  textDefaultColor: string;
  selectedTextColor: string;
  mainColor: string;
  textSecondaryColor: string;
  borderColor: string;
  defaultFont: string;
  headerFont: string;
  textFontSize: number;
  textHeaderFontSize: number;
  headerAnimationDistance: number;
  daysAnimationDistance: number;
  badgeColor: string;
  dayBackgroundColor?: string;
  dayItemSize: number;
};

type Props = {
  onSelectedChange?: (selectedDate: string) => void;
  onMonthYearChange?: (formattedDate: string) => void;
  onTimeChange?: (time: string) => void;
  onDateChange?: (formattedDate: string) => void;
  current?: string;
  selected?: string;
  minimumDate?: string;
  maximumDate?: string;
  selectorStartingYear?: number;
  selectorEndingYear?: number;
  disableDateChange?: boolean;
  configs?: Configs;
  options?: Partial<Options>;
  mode?: Mode;
  minuteInterval?: MinuteInterval;
  style?: StyleProp<ViewStyle>;
  badgeDates?: Record<string, boolean>;
  onCalendarStateChange?: (state: CalendarState) => void;
};

const DatePicker = ({
  onSelectedChange,
  onMonthYearChange,
  onTimeChange,
  onDateChange,
  current = '',
  selected = '',
  minimumDate = '',
  maximumDate = '',
  selectorStartingYear = 0,
  selectorEndingYear = 3000,
  disableDateChange = false,
  configs,
  options,
  mode = 'datepicker',
  minuteInterval = 5,
  style,
  badgeDates,
onCalendarStateChange,
}: Props) => {
  const calendarUtils = new Utils({
    minimumDate,
    maximumDate,
    configs,
    mode,
  });

  const state =useReducer(reducer, {
    activeDate: current || calendarUtils.getToday(),
    selectedDate: selected ? calendarUtils.getFormated(calendarUtils.getDate(selected)) : '',
    monthOpen: mode === 'monthYear',
    timeOpen: mode === 'time',
  })
  
  const contextValue: CalendarContextType = {
    onSelectedChange,
    onDateChange,
    mode,
    options: {...defaultOptions, ...options},
    utils: calendarUtils,
    disableDateChange,
    minimumDate,
    maximumDate,
    selectorStartingYear,
    selectorEndingYear,
    onMonthYearChange,
    minuteInterval,
    onTimeChange,
    badgeDates,
    state,
  };
  const [minHeight, setMinHeight] = useState(300);
  const themedStyles = styles(contextValue.options);

  useEffect(() => {
    onCalendarStateChange?.(state[0]);
  }, [state[0], onCalendarStateChange])

  const renderBody = () => {
    switch (contextValue.mode) {
      default:
      case 'datepicker':
        return (
          <React.Fragment>
            <Calendar />
            <SelectMonth />
            <SelectTime />
          </React.Fragment>
        );
      case 'calendar':
        return (
          <React.Fragment>
            <Calendar />
            <SelectMonth />
          </React.Fragment>
        );
      case 'monthYear':
        return <SelectMonth />;
      case 'time':
        return <SelectTime />;
    }
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      <View
        style={[themedStyles.container, {minHeight}, style]}
        onLayout={({nativeEvent}) => setMinHeight(nativeEvent.layout.width * 0.9 + 55)}>
        {renderBody()}
      </View>
    </CalendarContext.Provider>
  );
};

const styles = (theme: Options) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
    },
  });

const minuteIntervalArray = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60] as const;
export type MinuteInterval = typeof minuteIntervalArray[number];

DatePicker.defaultProps = {
  onSelectedChange: () => null,
  onMonthYearChange: () => null,
  onTimeChange: () => null,
  onDateChange: () => null,
  current: '',
  selected: '',
  minimumDate: '',
  maximumDate: '',
  selectorStartingYear: 0,
  selectorEndingYear: 3000,
  disableDateChange: false,
  configs: {},
  options: {},
  mode: 'datepicker',
  minuteInterval: 5,
  style: {},
};

export default DatePicker;
