const dayjs = require("dayjs")

const startMonth = dayjs().startOf('month').toDate();
const endMonth = dayjs().endOf('month').toDate();

const startMonthPrev = dayjs().startOf('month').subtract(1, 'month').toDate();
const endMonthPrev = dayjs().endOf('month').subtract(1, 'month').toDate();

const getDate = {
    startMonth,
    endMonth,
    startMonthPrev,
    endMonthPrev
}

module.exports = getDate