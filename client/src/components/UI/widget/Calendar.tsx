import { css } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import localeData from 'dayjs/plugin/localeData';
import React, { Fragment, useEffect, useState } from 'react';
import { getMonthsOfWeek, isToday } from '../../../util/date';

dayjs.extend(localeData);

interface CalendarProps {
  startDate: Date;
  endDate: Date;
  data?: any;
  onClick?: (event: React.MouseEvent) => void;
  onDateClick?: (event: React.MouseEvent) => void;
  isMonthTop?: boolean;
  weekIdx?: number;
  locale?: string;
  blurAfterToday?: boolean;
  cellHeight?: string;
}

const tdHoverStyle = css({
  '&:hover': {
    cursor: 'pointer',
    fontWeight: 600,
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--round-md)',
  },
});

const todayAfterStyle = css({
  '&::after': {
    content: '""',
    display: 'block',
    backgroundColor: 'var(--primary)',
    width: '0.25rem',
    height: '0.25rem',
    borderRadius: '50%',
  },
});

function Calendar({
  startDate,
  endDate,
  data,
  onClick,
  onDateClick,
  isMonthTop,
  weekIdx,
  locale,
  blurAfterToday,
  cellHeight,
}: CalendarProps) {
  //   const { startDate, endDate, isMonthTop, weekIdx, locale } = props;
  const [dates, setDates] = useState<Dayjs[]>([]);
  const [weeks, setWeeks] = useState<(Dayjs | null)[][]>([]);
  const [monthState, setMonthState] = useState('');

  const propsCode = locale?.split('-')[0] || '';
  const code = ['ko', 'en'].includes(propsCode) ? propsCode : 'en';
  dayjs.locale(code);

  // date
  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'days');

    const dates = [];
    for (let i = 0; i <= diff; i++) {
      const date = dayjs(startDate).add(i, 'days');
      dates.push(date);
    }

    setDates(dates);
  }, [startDate, endDate]);

  // weeks
  useEffect(() => {
    const weeks: (Dayjs | null)[][] = [];
    let week: (Dayjs | null)[] = [];

    if (dates.length === 0) {
      return;
    }

    dates.forEach((date) => {
      // to next week
      if (week.length > 0 && date.day() === 0) {
        weeks.push(week);
        week = [];
      }

      // set start point of first week
      if (weeks.length === 0 && week.length === 0) {
        for (let i = 0; i < date.day(); i++) {
          week.push(null);
        }
      }

      // collect days for week
      week.push(date);
    });

    if (week.length > 0) {
      weeks.push(week);
    }

    setWeeks(weeks);
  }, [dates]);

  // month
  useEffect(() => {
    if (weeks.length === 0) {
      return;
    }

    if (weekIdx !== undefined) {
      const month = getMonthsOfWeek(weeks[weekIdx]);
      setMonthState(month);
    }
  }, [weeks, weekIdx]);

  // <tr>
  const getMonthTr = (week: (Dayjs | null)[], i: number) => {
    const tds = week.map((day, i) => {
      if (day?.get('date') === 1 || day?.get('date') === startDate.getDate()) {
        return (
          <td key={i} className="h-0 text-md semi-bold">
            {day?.format('MMM')}
          </td>
        );
      } else {
        return <td key={i} />;
      }
    });

    return <tr key={i + '-month'}>{tds}</tr>;
  };

  const getTdClass = (day: Dayjs | null) => {
    const target = dayjs(day?.format('YYYY-MM-DD'));
    const today = dayjs(dayjs().format('YYYY-MM-DD'));

    if (blurAfterToday && target && target > today) {
      return 'o-0.5';
    } else {
      return '';
    }
  };

  const weekTr = weeks.map((week, i) => {
    return (
      <Fragment key={i}>
        {!isMonthTop && getMonthTr(week, i)}
        <tr key={i}>
          {week.map((day, i) => {
            return (
              <td
                key={i}
                className={`relative pt-0.25 text-md v-top light ${getTdClass(day)}`}
                css={css(
                  {
                    height: cellHeight || 'auto',
                  },
                  tdHoverStyle
                )}
                data-date={day?.format('YYYY-MM-DD')}
                onClick={onDateClick}
              >
                <span
                  className={
                    isToday(day) ? 'extra-bold text-primary flex-column i-center' : ''
                  }
                  css={isToday(day) ? todayAfterStyle : undefined}
                >
                  {day?.format('D')}
                </span>
                {day && data && data[day.format('YYYY-MM-DD')]}
              </td>
            );
          })}
        </tr>
      </Fragment>
    );
  });

  return (
    <div>
      {isMonthTop && <h6 className="text-center">{monthState}</h6>}
      <table
        className="text-center w-100 h-100"
        onClick={onClick}
        css={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            {dayjs.weekdaysShort().map((day: string, i) => (
              <th key={i} className="text-xs">
                {day?.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="scroll-y">
          {weekIdx !== undefined ? weekTr[weekIdx] : weekTr}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
