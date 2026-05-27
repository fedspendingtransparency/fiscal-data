# Spending Explainer Data Sources & Methodologies

The [Spending Explainer page](https://fiscaldata.treasury.gov/federal-spending/) is intended to give a high-level overview on the topic of U.S. national spending. Here, we document the datasets, API calls, and calculations used to source data for each visualization on the page.


## How much has the U.S. government spent this year?

**Source:** [Monthly Treasury Statements](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year&filter=line_code_nbr:eq:5691&sort=-record_date&page[size]=1

The flipcard shows `current_fytd_net_outly_amt`, rounded to the nearest dollar. 


## U.S. Government Spending

### Category

**Source:** [Monthly Treasury Statements](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19

Bar chart shows `current_fytd_rcpt_outly_amt` by `classification_desc` in dollars or percentage of spending.

### Agency

**Source:** [Monthly Treasury Statements](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30

Bar chart shows `current_fytd_net_outly_amt` by `classification_desc` in dollars or percentage of spending.

## Government Spending and the U.S. Economy
### Total Spending values

**Source:** [Monthly Treasury Statements](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date	

Total Spending (FY) is the last entry in a given fiscal year (i.e., end of September) for `current_fytd_net_outly_amt`, with year represented by `record_fiscal_year`.

## Values Common Across the Spending Explainer
Two kinds of data are needed for many of the visualizations on this page. These are: Gross Domestic Product, and Consumer Price Index.

### Gross Domestic Product (GDP) values	

**Source:** [National Income and Product Accounts Table 1.1.5](https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&categories=survey) (Bureau of Economic Analysis)

**API call:** https://apps.bea.gov/api/data/?UserID=X&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON	

Users can replace X in year=X with single year or comma separated list of years to filter by year. Users also will need to register and replace the UserID "X" with their unique registration key.

To determine a fiscal year (FY) annual GDP value, we average the relevant quarterly values. As the fiscal year runs from October through September, we average four relevant quarterly values from calendar year Q4 of the previous calendar year through calendar year Q3.* When the spending value is available before BEA releases its estimates for the final fiscal year quarterly value (calendar year Q3), we average across the three most recent quarterly values available. The fiscal year GDP value is updated when BEA releases its Second and Third (final) Estimates for the quarter.
Before using the API, users must obtain a unique 36-character UserID.  This UserID will replace "X" in the API call above.

\* Prior to 1977, the fiscal year ran from July to June. The Congressional Budget Act of 1974 (Section 501 of P.L. 93-344, currently codified at 31 U.S.C. 1102) took effect and shifted the fiscal year cycle between FY 1976 and 1977. Starting with FY 1977, the fiscal year starts on October 1 and ends on September 30.

GDP (FY) is a line of average(`DataValue`) for a particular FY by `record_fiscal_year`.

### Consumer Price Index (CPI) values

**Source:** [Consumer Price Index for All Urban Consumers (CPI-U)](https://data.bls.gov/timeseries/CUUR0000SA0) (Bureau of Labor Statistics)

**API call:** https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=YYYY&endyear=YYYY

Users can replace "YYYY" with the years they would like to view.

### Calculations
We adjust spending and GDP values for inflation, and calculate percentage of GDP using the following:

*Adjusted spending = `current_fytd_net_outly_amt` x (Current Dollar CPI / CPI from month and year of `record_fiscal_year`)* <br>
*Adjusted GDP = average(`DataValue`) x (Current Dollar CPI / CPI from month and year of `record_fiscal_year`)*	<br>
*Percentage of GDP = `current_fytd_net_outly_amt` / average(`DataValue`)*
