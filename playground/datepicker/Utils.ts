import {useRef, useState} from 'react';
import {Animated, Easing, I18nManager, StyleProp, ViewStyle} from 'react-native';
import moment, {Moment} from 'moment';
import type {ChangeMonthAnimationType, Configs, Mode} from './types';

const m = moment();

const gregorianConfigs: Configs = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  selectedFormat: 'YYYY/MM/DD',
  dateFormat: 'YYYY/MM/DD',
  monthYearFormat: 'YYYY MM',
  timeFormat: 'HH:mm',
  hour: 'Hour',
  minute: 'Minute',
  timeSelect: 'Select',
  timeClose: 'Close',
};

class Utils {
  data: {
    minimumDate?: string;
    maximumDate?: string;
  };

  config: Configs;

  constructor({
    minimumDate,
    maximumDate,
    mode,
    configs = {},
  }: {
    minimumDate?: string;
    maximumDate?: string;
    mode?: Mode;
    configs?: Object;
  }) {
    this.data = {
      minimumDate,
      maximumDate,
    };
    this.config = gregorianConfigs;
    this.config = {...this.config, ...configs};
    if (mode === 'time' || mode === 'datepicker') {
      this.config.selectedFormat = this.config.dateFormat + ' ' + this.config.timeFormat;
    }
  }

  get flexDirection(): StyleProp<ViewStyle> {
    return {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
    };
  }

  getFormated = (
    date: Moment,
    formatName:
      | 'selectedFormat'
      | 'dateFormat'
      | 'monthYearFormat'
      | 'timeFormat' = 'selectedFormat',
  ) => date.format(this.config[formatName]);

  getFormatedDate = (date = new Date(), format = 'YYYY/MM/DD') => moment(date).format(format);

  getTime = (time: string) => this.getDate(time).format(this.config.timeFormat);

  getToday = () => this.getFormated(m, 'dateFormat');

  getMonthName = (month: number) => this.config.monthNames[month];

  toEnglish = (value: string) => {
    const charCodeZero = '۰'.charCodeAt(0);
    return value.replace(/[۰-۹]/g, w => (w.charCodeAt(0) - charCodeZero).toString());
  };

  getDate = (time?: string) => moment(time, this.config.selectedFormat);

  getMonthYearText = (time: string) => {
    const date = this.getDate(time);
    const year = this.toEnglish(String(date.year()));
    const month = this.getMonthName(date.month());
    return `${month} ${year}`;
  };

  checkMonthDisabled = (time: string) => {
    const {minimumDate, maximumDate} = this.data;
    const date = this.getDate(time);
    let disabled = false;
    if (minimumDate) {
      const lastDayInMonth = date.date(29);
      disabled = lastDayInMonth < this.getDate(minimumDate);
    }
    if (maximumDate && !disabled) {
      const firstDayInMonth = date.date(1);
      disabled = firstDayInMonth > this.getDate(maximumDate);
    }
    return disabled;
  };

  checkArrowMonthDisabled = (time: string, next: boolean) => {
    const date = this.getDate(time);
    return this.checkMonthDisabled(this.getFormated(date.add(next ? -1 : 1, 'month')));
  };

  checkYearDisabled = (year: number, next: boolean) => {
    const {minimumDate, maximumDate} = this.data;
    const y = this.getDate(next ? maximumDate : minimumDate).year();
    return next ? year >= y : year <= y;
  };

  checkSelectMonthDisabled = (time: string, month: string | number) => {
    const date = this.getDate(time);
    const dateWithNewMonth = date.month(month);
    return this.checkMonthDisabled(this.getFormated(dateWithNewMonth));
  };

  validYear = (time: string, year: number) => {
    const {minimumDate, maximumDate} = this.data;
    const date = this.getDate(time).year(year);
    let validDate = this.getFormated(date);
    if (minimumDate && date < this.getDate(minimumDate)) {
      validDate = minimumDate;
    }
    if (maximumDate && date > this.getDate(maximumDate)) {
      validDate = maximumDate;
    }
    return validDate;
  };

  getMonthDays = (time: string) => {
    const {minimumDate, maximumDate} = this.data;
    let date = this.getDate(time);
    const currentMonthDays = date.daysInMonth();
    const firstDay = date.date(1);
    const dayOfMonth = (firstDay.day() + 0) % 7;

    return [
      ...new Array(dayOfMonth),
      ...[...new Array(currentMonthDays)].map((_, n) => {
        const thisDay = date.date(n + 1);
        let disabled = false;

        if (minimumDate) {
          disabled = thisDay < this.getDate(minimumDate);
        }

        if (maximumDate && !disabled) {
          disabled = thisDay > this.getDate(maximumDate);
        }

        date = this.getDate(time);

        return {
          dayString: this.toEnglish(String(n + 1)),
          day: n + 1,
          date: this.getFormated(date.date(n + 1)),
          disabled,
        };
      }),
    ];
  };

  useMonthAnimation = (
    activeDate: string,
    distance: number,
    onEnd?: () => void,
  ): [
    {
      lastDate: string;
      shownAnimation: Animated.WithAnimatedObject<ViewStyle>;
      hiddenAnimation: Animated.WithAnimatedObject<ViewStyle>;
    },
    (type: ChangeMonthAnimationType) => void,
  ] => {
    const [lastDate, setLastDate] = useState(activeDate);
    const [changeWay, setChangeWay] = useState<ChangeMonthAnimationType>();
    const monthYearAnimation = useRef(new Animated.Value(0)).current;

    const changeMonthAnimation = (type: ChangeMonthAnimationType) => {
      setChangeWay(type);
      setLastDate(activeDate);
      monthYearAnimation.setValue(1);

      Animated.timing(monthYearAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.33, 0.66, 0.54, 1),
      }).start(onEnd);
    };

    const shownAnimation: Animated.WithAnimatedObject<ViewStyle> = {
      opacity: monthYearAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
      }),
      transform: [
        {
          translateX: monthYearAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, changeWay === 'NEXT' ? -distance : distance],
          }),
        },
      ],
    };

    const hiddenAnimation: Animated.WithAnimatedObject<ViewStyle> = {
      opacity: monthYearAnimation,
      transform: [
        {
          translateX: monthYearAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [changeWay === 'NEXT' ? distance : -distance, 0],
          }),
        },
      ],
    };

    return [{lastDate, shownAnimation, hiddenAnimation}, changeMonthAnimation];
  };
}

export default Utils;
