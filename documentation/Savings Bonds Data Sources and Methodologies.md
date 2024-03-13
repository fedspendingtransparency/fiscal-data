# Savings Bonds Explainer Data Sources and Methodology

The [Savings Bonds Explainer](https://fiscaldata.treasury.gov/treasury-savings-bonds/) is intended to give a high-level overview on the topic of U.S. Treasury Savings Bonds. Here we document the datasets, API calls, and calculations used to source data for each visualization on the page.

## How much has been invested in savings bonds this year?

**Source:** [Electronic Securities Transactions](https://fiscaldata.treasury.gov/datasets/electronic-securities-transactions/sales) \(Fiscal Data\)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:YYYY

Users can replace "YYYY" with the current fiscal year. Values reflect the sum of 'net_sales_amt', rounded to the nearest dollar.


## How Do Savings Bonds Help Finance the Federal Government?

**Source:** [U.S. Treasury Monthly Statement of Public Debt \(MSPD\)](https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding) \(Fiscal Data\)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?filter=record_date:eq:YYYY-MM-DD

Users can replace "YYYY-MM-DD" with the latest 'record_date'. Donut chart shows 'debt_held_public_mil_amt' as a percentage of 'security_type_desc' and 'security_class_desc'. This chart reflects total debt held by the public, which excludes debt held by the government \(Intragovernmental Holdings\).

For Non-marketable Securities, the following security classes are included as \"Other\": 
* State and Local Government Series
* Foreign Series
* Domestic Series
* Other


## What Influences the Purchase of Savings Bonds?

### Savings Bonds History
**Source:** Data prior to 2001 is available from [TreasuryDirect](https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/). Data from 2001 to present is available from the Electronic Securities Transactions](https://fiscaldata.treasury.gov/datasets/electronic-securities-transactions/sales) \(Fiscal Data\) dataset.

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond \(Fiscal Data\)

Chart shows 'net_sales_amt' for Savings Bonds with year represeented by 'record_fiscal_year'. For historical data, a one-time adjustment for accounting purposes was excluded from the data visualization. See the source data for the adjustment details.

##### Adjusting for Inflation
**Source:** [Consumer Price Index for All Urban Consumers (CPI-U)](https://data.bls.gov/timeseries/CUUR0000SA0) (Bureau of Labor Statistics)

**API call:** https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=YYYY&endyear=YYYY

Users can replace "YYYY" with the years they would like to view. 

*Adjusted savings bonds sales = 'net_sales_amt' x \(Current Dollar CPI / CPI from month and year of `record_fiscal_year`\)* <br>


### Interest Rates and Inflation
**I Bond Sales Source:** [Electronic Securities Transactions](https://fiscaldata.treasury.gov/datasets/electronic-securities-transactions/sales) \(Fiscal Data\)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond,security_class_desc:eq:I,record_fiscal_year:gte:YYYY&sort=-record_date

Users can replace "YYYY" with the fiscal year 15 years prior to the current year.

##### Inflation Values
**Inflation Source:** [Consumer Price Index for All Urban Consumers (CPI-U)](https://data.bls.gov/timeseries/CUUR0000SA0) (Bureau of Labor Statistics)

**API call:** https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=YYYY&endyear=YYYY

Users can replace "YYYY" with the years they would like to view. Values are shown as a 12 month percentage change. To view the calculated value as part of the API call, add "calculations=true". Users will need to register to access this parameter in their API call.

