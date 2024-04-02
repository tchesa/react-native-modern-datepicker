import {useState, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent} from 'react-native';

import type{Options } from '../DatePicker';
import useCalendar from '../hooks/useCalendar';

const Days = () => {
  const {options, state, utils, onDateChange, badgeDates } = useCalendar();
  const [mainState, setMainState] = state;
  const [width, setWidth] = useState(0);
  const style = styles(options);
  const days = useMemo(() => utils.getMonthDays(mainState.activeDate), []);

  const onSelectDay = (date: string) => {
    setMainState({
      type: 'set',
      selectedDate: date,
    });

    onDateChange?.(utils.getFormated(utils.getDate(date), 'dateFormat'));
  };

  const changeItemHeight = ({nativeEvent}: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  };

  const margin = useMemo(() => {
    return (width - options.dayItemSize * 7) / 14;
  }, [options.dayItemSize, width])

  const today = utils.getToday();

  return (
    <View style={[style.container, utils.flexDirection]} onLayout={changeItemHeight}>
      {days.map((day, n) => (
        <TouchableOpacity
          key={n}
          onPress={() => {
            !day.disabled && onSelectDay(day.date)
          }}
          activeOpacity={0.8}
          style={{
            width: options.dayItemSize + margin * 2,
            height: options.dayItemSize + margin * 2,
            padding: margin,
          }}
          disabled={!day}>
          {day && (
            <View
              style={[
                style.dayItem,
                {
                  borderRadius: options.dayItemSize / 2,
                },
                today === day.date && style.currentDayItem,
                mainState.selectedDate === day.date && style.dayItemSelected,
              ]}
            >
              <Text
                style={[
                  style.dayText,
                  mainState.selectedDate === day.date && style.dayTextSelected,
                  day.disabled && style.dayTextDisabled,
                ]}>
                {day.dayString}
              </Text>
              {badgeDates?.[day.date] && (
                <View style={style.badge} />
              )}
           </View> 
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = (theme: Options) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      flexWrap: 'wrap',
    },
    dayItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: theme.dayBackgroundColor,
      borderWidth: 1,
      borderColor: theme.dayBackgroundColor,
    },
    dayItemSelected: {
      backgroundColor: theme.mainColor,
      borderColor: theme.mainColor,
    },
    currentDayItem: {
      borderColor: theme.mainColor,
    },
    dayText: {
      fontFamily: theme.defaultFont,
      fontSize: theme.textFontSize,
      color: theme.textDefaultColor,
      textAlign: 'center',
      width: '100%',
    },
    dayTextSelected: {
      color: theme.selectedTextColor,
      fontFamily: theme.headerFont,
    },
    dayTextDisabled: {
      opacity: 0.2,
    },
    badge: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.badgeColor,
      position: 'absolute',
      bottom: -9,
      right: '50%',
      transform: [{translateX: 3}],
    }
  });

export default Days;
