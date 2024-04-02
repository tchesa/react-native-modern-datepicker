export type Mode = 'datepicker' | 'calendar' | 'monthYear' | 'time';

export type Configs = {
  dayNames: string[];
  dayNamesShort: string[];
  monthNames: string[];
  selectedFormat: string;
  dateFormat: string;
  monthYearFormat: string;
  timeFormat: string;
  hour: string;
  minute: string;
  timeSelect: string;
  timeClose: string;
};

export type ChangeMonthAnimationType = 'NEXT' | 'PREVIOUS';

export type CalendarState = {
  activeDate: string;
  selectedDate: string;
  monthOpen: boolean;
  timeOpen: boolean;
};
