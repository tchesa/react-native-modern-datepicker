import {StyleSheet, View} from 'react-native';
import DatePicker from './datepicker';
import {useRef} from 'react';

const colors = {
  // "inos-yellow": "#fbc552",
  // "inos-blue": "#0583ea",
  // "heart-rate-red": "#c22a43",
  'oxygen-blue': '#0B6BC2',
  // "p-index-orange": "#fd8e27",
  // "sleep-purple": "#7e61a3",
  'light-black': '#414141',
  'graph-gray': '#bababa',
  // "graph-text": "#989898",
  // "form-text": "#898989",
  // "light-blue": "#e4f3ff",
  // "button-border-left": "#FBC652",
  // "button-border-right": "#005499",
  // "button-bg-left": "#0374D1",
  // "button-bg-right": "#005499",
  // "button-outline-background": "#ffffff",
  // "auth-gradient-start": "#F9FCFF",
  // "auth-gradient-end": "#FFFCF4",
  // "settings-gradient-start": "#F9FCFF",
  // "settings-gradient-end": "#FFFCF4",
  // "tab-active": "#0B6BC2",
  // "tab-inactive": "#BABABA",
  // "toggle-bg": "#F6F6F6",
  // "toggle-border": "#d9d9d9",
  // "toggle-border-secondary": "#E3E3E3",
  // "device-connected-main": "#0374D1",
  // "device-connected-background": "#E4F3FF",
  // "device-disconnected-main": "#989898",
  // "device-disconnected-background": "#ECECEC",
  // "device-charging-main": "#529034",
  // "device-charging-background": "#B7ED9D",
  // "device-reading-main": "#C68A07",
  // "device-reading-background": "#F8DB9D",
  // "device-uploading-main": "#7E61A3",
  // "device-uploading-background": "#F8E4FF",
  // "device-error-main": "#C22A43",
  // "device-error-background": "#FFDDDD",
  white: '#ffffff',
  // "danger": "#C22A43",
  // "danger-text": "#FFE4E9",
  // "line-divider": "#EBEBEB",
  // "chart-axis": "#BABABA",
  // "oxygen-graph-bar": "#E4F3FF",
  // "pulse-rate-graph-bar": "#FFD3D6",
  // "p-index-graph-bar": "#FFDDBC",
  // "sleep-graph-bar": "#D7C4EE"
};

export default function App() {
  const badgeDates = useRef<Record<string, boolean>>({
    '2024/04/02': true,
  });

  return (
    <View style={styles.container}>
      <DatePicker
        options={{
          textHeaderColor: colors['oxygen-blue'],
          textDefaultColor: colors['light-black'],
          selectedTextColor: colors['white'],
          mainColor: colors['oxygen-blue'],
          textSecondaryColor: colors['light-black'],
          defaultFont: 'Lexend-Regular',
          borderColor: colors['graph-gray'],
          headerFont: 'Lexend-SemiBold',
          dayBackgroundColor: '#E4F3FF88',
          textFontSize: 14,
        }}
        // @ts-ignore-next-line - The type definition is incomplete
        // configs={configs}
        // mode={mode}
        mode="calendar"
        badgeDates={badgeDates.current}

        // current={
        //   date ? format(date, MODERN_DATEPICKER_CALENDAR_FORMAT) : undefined
        // }
        // selected={
        //   date ? format(date, MODERN_DATEPICKER_CALENDAR_FORMAT) : undefined
        // }
        // onDateChange={handleChange(MODERN_DATEPICKER_CALENDAR_FORMAT)}
        // style={{
        //   backgroundColor: "transparent",
        // }}
        // onMonthYearChange={handleChange(MODERN_DATEPICKER_MONTHYEAR_FORMAT)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
