const commonFilter = (data, columnName, selectedFilter, valueSet) => {
  return data.filter((item) => {
    const value = item[columnName];

    if (value === undefined || value === null) {
      // Handle cases where the value might be null or undefined
      if (selectedFilter === 'isNull') return value === null;
      if (selectedFilter === 'isNotNull') return value !== null;
      return false;
    }

    if (typeof value === 'number') {
      const numValue = parseInt(valueSet, 10);
      if (selectedFilter === 'equals') return value === numValue;
      if (selectedFilter === 'lessThan') return value < numValue;
      if (selectedFilter === 'lessThanOrEqual') return value <= numValue;
      if (selectedFilter === 'greaterThan') return value > numValue;
      if (selectedFilter === 'greaterThanOrEqual') return value >= numValue;
      if (selectedFilter === 'range') {
        const [rangeStart, rangeEnd] = valueSet.split(',').map(v => parseInt(v, 10));
        return value >= rangeStart && value <= rangeEnd;
      }
      if (selectedFilter === 'notEqual') return value !== numValue;
    } else if (typeof value === 'string') {
      const lowerValueSet = valueSet.toLowerCase();
      if (selectedFilter === 'contains') return value.toLowerCase().includes(lowerValueSet);
      if (selectedFilter === 'notContains') return !value.toLowerCase().includes(lowerValueSet);
      if (selectedFilter === 'equals') return value.toLowerCase() === lowerValueSet;
      if (selectedFilter === 'notEqual') return value.toLowerCase() !== lowerValueSet;
      if (selectedFilter === 'startsWith') return value.toLowerCase().startsWith(lowerValueSet);
      if (selectedFilter === 'endsWith') return value.toLowerCase().endsWith(lowerValueSet);
      if (selectedFilter === 'isNull') return !value;
      if (selectedFilter === 'isNotNull') return value;
    } else if (value instanceof Date) {
      const dateValueSet = new Date(valueSet);
      if (selectedFilter === 'dateIs') return value.toISOString().split('T')[0] === valueSet;
      if (selectedFilter === 'dateRange') {
        const [start, end] = valueSet.split(',').map(d => new Date(d));
        return value >= start && value <= end;
      }
      if (selectedFilter === 'equals') return value.toISOString().split('T')[0] === valueSet;
      if (selectedFilter === 'lessThan') return value < dateValueSet;
      if (selectedFilter === 'lessThanOrEqual') return value <= dateValueSet;
      if (selectedFilter === 'greaterThan') return value > dateValueSet;
      if (selectedFilter === 'greaterThanOrEqual') return value >= dateValueSet;
      if (selectedFilter === 'notEqual') return value.toISOString().split('T')[0] !== valueSet;
      if (selectedFilter === 'isNull') return !value;
      if (selectedFilter === 'isNotNull') return value;
    } else if (typeof value === 'boolean') {
      return selectedFilter === 'equals' && value.toString() === valueSet;
    } else if (Array.isArray(value)) {
      const valuesSet = valueSet.split(',');
      if (selectedFilter === 'in') return valuesSet.includes(value);
      if (selectedFilter === 'notIn') return !valuesSet.includes(value);
      if (selectedFilter === 'isNull') return value.length === 0;
    }

    return false;
  });
};

export default commonFilter;
