import {Dispatch, createContext} from 'react';
import Utils from '../Utils';
import {Action, CalendarState, MinuteInterval, Options} from '../DatePicker';
import {Mode} from '../types';

export type CalendarContextType = {
  mode: Mode;
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
  badgeDates?: Record<string, boolean>;
};

export const defaultOptions: Options = {
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
  badgeColor: '#C22A43',
};

const CalendarContext = createContext<CalendarContextType>({
  mode: 'datepicker',
  options: defaultOptions,
  utils: new Utils({
    minimumDate: '',
    maximumDate: '',
    configs: {},
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

export default CalendarContext;
