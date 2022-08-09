# Deficit Explainer Data Sources & Methodologies

The [Deficit Explainer page](https://fiscaldata.treasury.gov/deficit-url/) is intended to give a high-level overview on the topic of the U.S. national deficit. Here, we document the datasets, API calls, and calculations used to source data for each visualization on the page.


## What is the national deficit?

### Deficit FYTD and Prior Year FYTD

**Source:** [Monthly Treasury Statement (MTS) "Summary of Receipts and Outlays of the U.S. Government" table](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year&filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1

The flipcard shows the most recent 'current_fytd_net_outly_amt' value. For simplicity, we use the absolute value of the deficit throughout the analysis.


## U.S. Deficit Compared to Revenue and Spending

### Deficit

**Source:** [Monthly Treasury Statement (MTS) "Summary of Receipts and Outlays of the U.S. Government" table](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_calendar_month&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=-record_date&page[size]=1

We use the absolute value of 'current_fytd_net_outly_amt' to show the fiscal year total deficit.

### Revenue

**Source:** [Monthly Treasury Statement (MTS) "Summary of Receipts and Outlays of the U.S. Government" table](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?fields=current_fytd_net_rcpt_amt,record_date&filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page[size]=1

We use 'current_fytd_net_rcpt_amt' to show the fiscal year total revenue.

### Spending

**Source:** [Monthly Treasury Statement (MTS) "Summary of Receipts and Outlays of the U.S. Government" table](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_calendar_month&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=-record_date&page[size]=1

We use 'current_fytd_net_outly_amt' to show the fiscal year total spending.


## Federal Deficit Trends Over Time

### Fiscal Year Deficit/(Surplus)

**Source:** [Monthly Treasury Statement (MTS) "Summary of Receipts and Outlays of the U.S. Government" table](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government) (Fiscal Data)

**API call:** https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=record_date

For each year since 2015, deficit figures are the `current_fytd_net_outly_amt` values. For years prior to 2015, please reference the [MTS published reports](https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government) from September (fiscal year-end) of each year.