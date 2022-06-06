import {apiPrefix, basicFetch} from "../api-utils";

export const getDebtToGDP = () => {
  const debtEndpointUrl = 'v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948';
    basicFetch(`${apiPrefix}${debtEndpointUrl}`)
    .then((res) => {
      if (res.data) {
        const debtData = res.data;
        basicFetch(`https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`)
        .then((res) => {
          if(res.BEAAPI.Results.Data) {
            const gdpData = res.BEAAPI.Results.Data.filter(entry => entry.LineDescription === 'Gross domestic product');
            const averagedGDPByYear = [];
            // const currentYear = new Date().getFullYear();
            for(let i = 1948; i <= 2021; i++) {
              const allQuartersForGivenYear = gdpData.filter(entry => entry.TimePeriod.includes(i.toString()));
              console.log(allQuartersForGivenYear);
              let totalGDP = 0;
              allQuartersForGivenYear.forEach(quarter => {
                totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ''));
              })
             averagedGDPByYear.push({
               average: ((parseInt(String(totalGDP) + '000000')) / 4),
               year: i.toString()
             })
            }
            const debtToGDP = [];
            averagedGDPByYear.forEach(GDPEntry => {
              const record = debtData.find(entry => entry.record_date.includes(GDPEntry.year));
                debtToGDP.push({
                  year: parseInt(GDPEntry.year),
                  debtToGDP: Math.round(((parseFloat(record.debt_outstanding_amt) / GDPEntry.average) * 100))
                })
              });
          }
        });
      }
    });
}
