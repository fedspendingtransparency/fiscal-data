export const getAFGFootnotes = currentFiscalYear => {
    return [
      {
        text: 'i',
        link: 'CurrentFiscalYear',
        body: `The current fiscal year began on October 1, ${currentFiscalYear-1} and ends September 30, ${currentFiscalYear}.`,
      },
      {
        text: 'ii',
        link: 'LatestFiscalYear',
        body: `The latest complete fiscal year began on October 1, ${currentFiscalYear-2} and ended September 30, ${currentFiscalYear-1}.`,
      },
      {
        text: 'iii',
        link: 'PreviousFiscalYear',
        body: `The previous fiscal year began on October 1, ${currentFiscalYear-3} and ended September 30, ${currentFiscalYear-2}.`,
      },
    ];
  };