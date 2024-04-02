import React, {useReducer, useState } from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import PropTypes from 'prop-types';
import Calendar from './components/Calendar';
import SelectMonth from './components/SelectMonth';
import SelectTime from './components/SelectTime';
import Utils from './Utils';
import type {Configs, Mode} from './types';
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
};

export type CalendarState = {
  activeDate: string;
  selectedDate: string;
  monthOpen: boolean;
  timeOpen: boolean;
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
}: Props) => {
  const calendarUtils = new Utils({
    minimumDate,
    maximumDate,
    configs,
    mode,
  });

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
    state: useReducer(reducer, {
      activeDate: current || calendarUtils.getToday(),
      selectedDate: selected ? calendarUtils.getFormated(calendarUtils.getDate(selected)) : '',
      monthOpen: mode === 'monthYear',
      timeOpen: mode === 'time',
    }),
  };
  const [minHeight, setMinHeight] = useState(300);
  const themedStyles = styles(contextValue.options);

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

const optionsShape = {
  backgroundColor: PropTypes.string,
  textHeaderColor: PropTypes.string,
  textDefaultColor: PropTypes.string,
  selectedTextColor: PropTypes.string,
  mainColor: PropTypes.string,
  textSecondaryColor: PropTypes.string,
  borderColor: PropTypes.string,
  defaultFont: PropTypes.string,
  headerFont: PropTypes.string,
  textFontSize: PropTypes.number,
  textHeaderFontSize: PropTypes.number,
  headerAnimationDistance: PropTypes.number,
  daysAnimationDistance: PropTypes.number,
};
const modeArray: Array<Mode> = ['datepicker', 'calendar', 'monthYear', 'time'];
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

DatePicker.propTypes = {
  onSelectedChange: PropTypes.func,
  onMonthYearChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onDateChange: PropTypes.func,
  current: PropTypes.string,
  selected: PropTypes.string,
  minimumDate: PropTypes.string,
  maximumDate: PropTypes.string,
  selectorStartingYear: PropTypes.number,
  selectorEndingYear: PropTypes.number,
  disableDateChange: PropTypes.bool,
  configs: PropTypes.object,
  options: PropTypes.shape(optionsShape),
  mode: PropTypes.oneOf(modeArray),
  minuteInterval: PropTypes.oneOf(minuteIntervalArray),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default DatePicker;
