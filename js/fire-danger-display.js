(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.FireDangerDisplay = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function normalizedUnits(dataset) {
    return String(dataset?.displayValueType || dataset?.valueType || dataset?.units || 'index')
      .trim()
      .toLowerCase();
  }

  function numericOverride(dataset, key, fallback) {
    const value = dataset?.[key];
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function displayRule(dataset) {
    const units = normalizedUnits(dataset);

    if (['probability', 'prob', 'fraction', 'ratio', '0-1'].includes(units)) {
      return {
        label: dataset?.displayUnits || 'Probability (%)',
        scale: numericOverride(dataset, 'displayScale', 100),
        suffix: dataset?.displaySuffix ?? '%',
        precision: dataset?.displayPrecision
      };
    }

    if (['percent', 'percentage', '%'].includes(units)) {
      return {
        label: dataset?.displayUnits || 'Percent (%)',
        scale: numericOverride(dataset, 'displayScale', 1),
        suffix: dataset?.displaySuffix ?? '%',
        precision: dataset?.displayPrecision
      };
    }

    return {
      label: dataset?.displayUnits || 'Index',
      scale: numericOverride(dataset, 'displayScale', 1),
      suffix: dataset?.displaySuffix ?? '',
      precision: dataset?.displayPrecision
    };
  }

  function decimalPlaces(value, rule) {
    const explicitPrecision = Number(rule.precision);
    if (Number.isInteger(explicitPrecision) && explicitPrecision >= 0) return explicitPrecision;

    const absolute = Math.abs(value);
    if (absolute > 0 && absolute < 0.1) return 2;
    return 1;
  }

  function trimNumber(value) {
    return String(value).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }

  function formatValue(value, dataset) {
    const number = Number(value);
    if (!Number.isFinite(number)) return value ?? 'Not provided';

    const rule = displayRule(dataset);
    const displayValue = number * rule.scale;
    const rounded = displayValue.toFixed(decimalPlaces(displayValue, rule));
    return `${trimNumber(rounded)}${rule.suffix}`;
  }

  function formatRange(min, max, dataset) {
    return `${formatValue(min, dataset)} to ${formatValue(max, dataset)}`;
  }

  function unitsLabel(dataset) {
    return displayRule(dataset).label;
  }

  return {
    displayRule,
    formatRange,
    formatValue,
    unitsLabel
  };
});
