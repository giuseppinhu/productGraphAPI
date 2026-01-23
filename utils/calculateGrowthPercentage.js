const calculateGrowthPercentage = (prev, current) => {
  if (prev > 0) {
    return Number((((current - prev) / prev) * 100).toFixed(2));
  }
  return current > 0 ? 100 : 0;
};

module.exports = calculateGrowthPercentage;
