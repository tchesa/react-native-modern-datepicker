import React, {createContext, useReducer, useContext, useState, Dispatch} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import PropTypes from 'prop-types';

import {Calendar, SelectMonth, SelectTime} from './components';
import {Utils} from './Utils';
import {Configs, Mode} from './types';

const defaultOptions: Options = {
  backgroundColor: '#fff',
  textHeaderColor: '#212c35',
  textDefaultColor: '#2d4150',
  selectedTextColor: '#fff',
  mainColor: '#61dafb',
  textSecondaryColor: '#7a92a5',
  borderColor: 'rgba(122, 146, 165, 0.1)',
  defaultFont: 'System',
  headerFont: 'System',
  textFontSize: 15,
  textHeaderFontSize: 17,
  headerAnimationDistance: 100,
  daysAnimationDistance: 200,
};

type ActionType = 'set' | 'toggleMonth' | 'toggleTime';

type Action = {
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

type CalendarContextType = {
  mode: Mode;
  reverse: boolean;
  options: Options;
  utils: Utils;
  state: [CalendarState, Dispatch<Action>];
  onSelectedChange?: (selectedDate: string) => void;
  onDateChange?: (formattedDate: string) => void;
  disableDateChange: boolean;
  minimumDate: string;
  maximumDate: string;
  selectorStartingYear: number;
  selectorEndingYear: number;
  onMonthYearChange?: (formattedDate: string) => void;
  minuteInterval: MinuteInterval;
  onTimeChange?: (time: string) => void;
};

const CalendarContext = createContext<CalendarContextType>({
  mode: 'datepicker',
  reverse: false,
  options: defaultOptions,
  utils: new Utils({
    minimumDate: '',
    maximumDate: '',
    configs: {},
    reverse: false,
    mode: 'datepicker',
  }),
  state: [
    {
      activeDate: '',
      selectedDate: '',
      monthOpen: false,
      timeOpen: false,
    },
    () => null,
  ],
  disableDateChange: false,
  minimumDate: '',
  maximumDate: '',
  selectorStartingYear: 0,
  selectorEndingYear: 0,
  minuteInterval: 5,
});

const useCalendar = () => {
  const contextValue = useContext(CalendarContext);
  return contextValue;
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
  reverse?: true | false | 'unset';
  options?: Options;
  mode?: Mode;
  minuteInterval?: MinuteInterval;
  style?: StyleProp<ViewStyle>;
};

type CalendarState = {
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
  reverse = 'unset',
  options,
  mode = 'datepicker',
  minuteInterval = 5,
  style,
}: Props) => {
  const calendarUtils = new Utils({
    minimumDate,
    maximumDate,
    configs,
    reverse,
    mode,
  });

  const contextValue: CalendarContextType = {
    onSelectedChange,
    onDateChange,
    mode,
    reverse: reverse === 'unset' ? false : reverse,
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
type MinuteInterval = typeof minuteIntervalArray[number];

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
  reverse: 'unset',
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
  reverse: PropTypes.oneOf([true, false, 'unset']),
  options: PropTypes.shape(optionsShape),
  mode: PropTypes.oneOf(modeArray),
  minuteInterval: PropTypes.oneOf(minuteIntervalArray),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export {DatePicker, CalendarContext, useCalendar};
