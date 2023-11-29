export const getAFGFootnotes = currentFiscalYear => {
  return [
    {
      anchors: [{ text: ['1'], link: ['current-fiscal-year'] }],
      definition: `The ${currentFiscalYear} fiscal year began on October 1, ${currentFiscalYear - 1}, and ends September 30, ${currentFiscalYear}.`,
    },
    {
      anchors: [{ text: ['2'], link: ['previous-fiscal-year'] }],
      definition: `The ${currentFiscalYear - 1} fiscal year began on October 1, ${currentFiscalYear -
        2}, and ended September 30, ${currentFiscalYear - 1}.`,
    },
  ];
};
