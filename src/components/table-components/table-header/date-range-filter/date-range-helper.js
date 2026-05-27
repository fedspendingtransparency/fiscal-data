export const completeDate = date => {
  return !date?.includes('d') && !date?.includes('m') && !date?.includes('y');
};

export const datePlaceholder = 'mm/dd/yyyy';

export const dateRangePlaceholder = 'mm/dd/yyyy - mm/dd/yyyy';

export const dateFormat = 'MM/dd/yyyy';

export const dateFilterMinYear = 1900;
export const dateFilterMaxYear = 2999;
