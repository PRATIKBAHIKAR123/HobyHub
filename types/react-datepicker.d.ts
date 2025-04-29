declare module 'react-datepicker' {
  export interface ReactDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    dateFormat?: string;
    peekNextMonth?: boolean;
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    dropdownMode?: string;
    placeholderText?: string;
    className?: string;
  }

  const DatePicker: React.FC<ReactDatePickerProps>;
  export default DatePicker;
} 