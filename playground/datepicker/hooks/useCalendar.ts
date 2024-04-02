import {useContext} from 'react';
import CalendarContext from '../context/CalendarContext';

const useCalendar = () => {
  const contextValue = useContext(CalendarContext);
  return contextValue;
};

export default useCalendar;
