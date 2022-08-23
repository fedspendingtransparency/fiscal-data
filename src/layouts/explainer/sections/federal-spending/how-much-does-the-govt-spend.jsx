import React, { useState, useEffect, FunctionComponent } from "react"
import Card from "@material-ui/core/Card"
import { MuiThemeProvider } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { theme } from "../../../../theme"
import { apiPrefix, basicFetch } from "../../../../utils/api-utils"
import { card } from "../../../../components/home-highlight-cards/home-highlight-cards.module.scss"

const cardStyles = {
  root: {
    fontSize: "1rem",
    background: "darkgrey",
  },
}

const getChartData = () => {
  // how to make api calls

  //api.fiscaldata.treasury.gov/services/api/fiscal_service/
  //   https: //api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=record_calendar_month:eq:09,data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30
  //   https:

  basicFetch(
    `${apiPrefix}${`v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F,record_calendar_month:eq:09&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19`}`
  ).then(result => {
    console.log(result, "THE RESULT")
  })

  basicFetch(
    `${apiPrefix}${`v1/accounting/mts/mts_table_5?filter=record_calendar_month:eq:09,data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30`}`
  ).then(result => {
    console.log(result, "THE RESULT2")
  })
}

const HowMuchDoesTheGovtSpend = props => {
  const mocks = [{ hi: "hello" }, { hi: "howdy" }]
  useEffect(() => {
    getChartData()
  }, [])
  return (
    <MuiThemeProvider theme={theme}>
      <Card
        data-testid="highlight-card"
        style={{ background: "grey" }}
        className={card}
      >
        {mocks.map(mock => {
          return <div style={{ background: "#00766C" }}>{mock.hi}</div>
        })}
      </Card>
    </MuiThemeProvider>
  )
}

export default withStyles(cardStyles)(HowMuchDoesTheGovtSpend)
