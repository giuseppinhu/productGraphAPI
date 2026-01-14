const dayjs = require("dayjs");

const startMonth = dayjs().startOf("month").toDate();
const endMonth = dayjs().endOf("month").toDate();

const startMonthPrev = dayjs().startOf("month").subtract(1, "month").toDate();
const endMonthPrev = dayjs().endOf("month").subtract(1, "month").toDate();

const start = dayjs().subtract(11, "month").startOf("month").toDate();
const end = dayjs().endOf("month").toDate();

const startWeek = dayjs().startOf("week").toDate();
const endWeek = dayjs().endOf("week").toDate();

const getDate = {
  startMonth,
  endMonth,
  startMonthPrev,
  endMonthPrev,
  start,
  end,
  startWeek,
  endWeek,
};

module.exports = getDate;
