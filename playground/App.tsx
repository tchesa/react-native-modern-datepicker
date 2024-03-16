import {StyleSheet, View} from 'react-native';
import DatePicker from './datepicker';

export default function App() {
  return (
    <View style={styles.container}>
      <DatePicker
        // options={{
        //   textHeaderColor: colors["oxygen-blue"],
        //   textDefaultColor: colors["light-black"],
        //   selectedTextColor: colors["white"],
        //   mainColor: colors["oxygen-blue"],
        //   textSecondaryColor: colors["light-black"],
        //   defaultFont: "Lexend-Regular",
        //   borderColor: colors["graph-gray"],
        //   headerFont: "Lexend-SemiBold",
        // }}
        // @ts-ignore-next-line - The type definition is incomplete
        // configs={configs}
        // mode={mode}
        mode="calendar"
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