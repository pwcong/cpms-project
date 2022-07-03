import dayjs from "dayjs";

/**
 * 计算中国周
 * @param {Dayjs} date
 */
function getDay4CN(date) {
  return (date.day() + 6) % 7;
}

/**
 * 计算一年所有周
 * @param {number} year
 */
export function getWeeksOfYear(year) {
  // 计算一年的第一天
  const firstDay = dayjs(new Date(year, 0, 1)).startOf("y");

  // 计算星期几，0（周一） ～ 6（周日）
  const day = getDay4CN(firstDay);

  // 计算一年的第一周的第一天
  let firstWeekDay;
  if (day > 3) {
    firstWeekDay = firstDay.add(7 - day, "d");
  } else {
    firstWeekDay = firstDay.subtract(day, "d");
  }

  const weeks = [];
  let t = firstWeekDay.clone();
  while (t.year() <= year) {
    const start = t.clone();
    const end = t.add(6, "d");

    if (end.year() > year && end.date() >= 4) {
      // 跨年部分，哪一年天个数多就属于哪一年
    } else {
      weeks.push({
        start: start.startOf("d"),
        end: end.endOf("d"),
      });
    }

    t = t.add(7, "d");
  }

  return weeks;
}

/**
 * 计算日期所在一年的第几周
 * @param {Dayjs} date
 */
export function getWeekInYear(date) {
  let year = date.year();
  const _year = date.subtract(6, "d").year();

  if (_year !== year && getDay4CN(date) > 3) {
    year = _year;
  }

  const weeks = getWeeksOfYear(year);

  let currentWeek = weeks.findIndex((d) => {
    return (
      date.valueOf() >= d.start.valueOf() && date.valueOf() <= d.end.valueOf()
    );
  });
  if (currentWeek <= -1) {
    currentWeek = 0;
  }

  return currentWeek;
}

/**
 * 计算日期所在的周
 */
export function getWeekOfDate(date) {
  const weeks = getWeeksOfYear(date.year());
  const weekNumber = getWeekInYear(date);

  return {
    weekNumber,
    week: weeks[weekNumber],
  };
}

/**
 * 计算下一周
 * @param {number} year
 * @param {number} week
 */
export function getNextWeek(year, week) {
  let nextWeek;

  const weeks = getWeeksOfYear(year);

  if (week + 1 > weeks.length - 1) {
    nextWeek = getWeeksOfYear(year + 1)[0];
  } else {
    nextWeek = weeks[week + 1];
  }

  return nextWeek;
}
