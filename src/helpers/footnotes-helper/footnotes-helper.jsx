export const getAFGFootnotes = currentFiscalYear => {
    return [
      {
        anchors: [
          { text: ['1'], link: ['current-fiscal-year'] },
          { text: ['2'], link: ['current-fiscal-year2'] },
        ],
        definition: `The current fiscal year began on October 1, ${currentFiscalYear -
          1} and ends September 30, ${currentFiscalYear}.`,
      },
      {       
        anchors: [          
          { text: ['3'], link: ['previous-fiscal-year'] },
        ],
        definition: `The previous fiscal year began on October 1, ${currentFiscalYear -
          2} and ended September 30, ${currentFiscalYear - 1}.`,
      },
    ];
  };