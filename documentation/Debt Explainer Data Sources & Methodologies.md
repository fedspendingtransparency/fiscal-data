# Debt Explainer Data Sources & Methodologies

The [National Debt Explainer page](https://fiscaldata.treasury.gov/national-debt/) is intended to give a high-level overview on the topic of federal debt. This README documents the datasets, API calls, and calculations used to source data for visualizations on the page.


## What is the national debt?

**Source:** [Debt to the Penny](https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=1
https://api.fiscaldata.treasury.gov/services/api/fiscal_service
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates
{"data":[{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.426","record_date":"2020-03-31"},

{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.26","record_date":"2021-03-31"},

{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.275","record_date":"2020-12-31"},

{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.368","record_date":"2020-06-30"},

{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.239","record_date":"2021-06-30"},

{"country_currency_desc":"Canada-Dollar",

"exchange_rate":"1.338","record_date":"2020-09-30"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"19.913","record_date":"2020-12-31"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"23.791","record_date":"2020-03-31"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"23.164","record_date":"2020-06-30"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"20.067","record_date":"2020-09-30"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"20.518","record_date":"2021-03-31"},

{"country_currency_desc":"Mexico-Peso",

"exchange_rate":"19.838","record_date":"2021-06-30"}],

"meta":{"count":12,"labels":{

"country_currency_desc":"Country-CurrencyDescription",

"exchange_rate":"ExchangeRate","record_date":"RecordDate"},

"dataTypes":{"country_currency_desc":"STRING","exchange_rate":"NUMBER", "record_date":"DATE"},

"dataFormats":{"country_currency_desc":"String","exchange_rate":"10.2", "record_date":"YYYY-MM-DD"},

"total-count":12,"total-pages":1},

"links":{"self":"&page%5Bnumber%5D=1&page%5Bsize%5D=100",

"first":"&page%5Bnumber%5D=1&page%5Bsize%5D=100","prev":null,

"next":null,"last":"&page%5Bnumber%5D=1&page%5Bsize%5D=100"}}

The flipcard shows `tot_pub_debt_out_amt`, rounded to the nearest dollar.

https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?fields=country_currency_desc, exchange_rate,record_date&filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso), record_date:gte:2020-01-01

https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate, record_date&filter=record_date:gte:2015-01-01

/v1/accounting/od/rates_of_exchange
https://api.fiscaldata.treasury.gov/services/api/fiscal_service

fields=country_currency_desc,exchange_rate,record_date&filter=record_date:gte:2015-01-01
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/reference/data_registry/fmr_data_elements
https://www.fiscal.treasury.gov/files/g-invoice/g-invoicing-rules-of-engagement.pdf
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/reference/data_registry/fmr_situational_metadata

## U.S. National Debt Over the Last 100 Years

### Deb
t values

**Source:** [Historical Debt Outstanding](https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/historical-debt-outstanding) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101

### Consumer Price Index (CPI) values

**Source:** [Consumer Price Index for All Urban Consumers (CPI-U)](https://data.bls.gov/timeseries/CUUR0000SA0) (Bureau of Labor Statistics)

**API call:** https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=YYYY&endyear=YYYY

Users need to add their own dates to make the call work.

"CUUR0000SA0" is the Series ID for CPI-U 1982-84=100. We call the [BLS Public Data API](https://www.bls.gov/developers/home.htm) using increments of 10 years (20 years with registration key).

### Calculations
We adjust debt values for inflation using the following: 

*`debt_outstanding amt` x (Current dollar CPI / CPI from month and year of `record_date`) = Inflation-adjusted debt value in current dollars*


## Federal Debt Trends Over Time (Debt-to-GDP)

### Debt values

**Source:** [Historical Debt Outstanding](https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/historical-debt-outstanding) (Fiscal Data)

**API call:**  https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948

### Gross Domestic Product (GDP) values

**Source:** [National Income and Product Accounts Table 1.1.5](https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&categories=survey) (Bureau of Economic Analysis)

**API call:** https://apps.bea.gov/api/data/?UserID=X&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON

To determine a fiscal year (FY) annual GDP value, we average the relevant quarterly values. As the fiscal year runs from October through September, we average four relevant quarterly values from calendar year Q4 of the previous calendar year through calendar year Q3.* When the debt value is available before BEA releases its estimates for the final fiscal year quarterly value (calendar year Q3), we average across the three most recent quarterly values available. The fiscal year GDP value is updated when BEA releases its Second and Third (final) Estimates for the quarter.

Before using the API, users must obtain a unique 36-character UserID.  This UserID will replace "X" in the API call above.

\* Prior to 1977, the fiscal year ran from July to June. The Congressional Budget Act of 1974 (Section 501 of P.L. 93-344, currently codified at 31 U.S.C. 1102) took effect and shifted the fiscal year cycle between FY 1976 and 1977. Starting with FY 1977, the fiscal year starts on October 1 and ends on September 30.  GDP values prior to 1977 will use the relevant quarterly estimates for calendar year Q3 through calendar year Q2.


### Calculations
 We compare `debt_outstanding_amt` values to the relevant fiscal year GDP values.


## Intragovernmental Holdings and Debt Held by the Public

**Source:** [Monthly Statement of the Public Debt (MSPD) "Summary of Treasury Securities Outstanding" table](https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?sort=-record_date&filter=record_calendar_month:eq:12,security_type_desc:eq:Total%20Public%20Debt%20Outstanding&page[size]=11

We use calendar year-end `debt_held_public_mil_amt` and `intragov_hold_mil_amt` values where `security_class_desc` equals "Total Public Debt Outstanding".


## Interest Rate and Total Debt

### Interest rate values 

**Source:** [Average Interest Rates on U.S. Treasury Securities](https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?sort=-record_date&filter=record_calendar_month:eq:09,security_type_desc:eq:Interest-bearing%20Debt&page[size]=11

The line chart shows calendar year-end `avg_interest_rate_amt` values where `security_type_desc` equals "Interest-bearing Debt. 

### Debt values

**Source:** [Monthly Statement of the Public Debt (MSPD) "Summary of Treasury Securities Outstanding" table](https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_1?sort=-record_date&filter=record_calendar_month:eq:09,security_type_desc:eq:Total%20Public%20Debt%20Outstanding&page[size]=11

The area chart shows calendar year-end `total_mil_amt` values where `security_class_desc` equals "Total Public Debt Outstanding".

