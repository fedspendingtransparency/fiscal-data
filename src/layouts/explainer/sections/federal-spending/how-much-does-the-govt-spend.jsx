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

const HowMuchDoesTheGovtSpend = props => {
  const [chartData, setChartData] = useState(null)
  const getChartData = () => {
    Promise.all([
      basicFetch(
        `${apiPrefix}${`v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F,record_calendar_month:eq:09&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19`}`
      ),
      basicFetch(
        `${apiPrefix}${`v1/accounting/mts/mts_table_5?filter=record_calendar_month:eq:09,data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30`}`
      ),
    ]).then(result => {
      setChartData({
        category: result[0],
        agency: result[1],
      })
    })
  }
  useEffect(() => {
    getChartData()
  }, [])

  let sortedCategoryItems = chartData?.category.data.sort((a, b) => {
    return b.current_fytd_rcpt_outly_amt - a.current_fytd_rcpt_outly_amt
  })

  const total = sortedCategoryItems
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)

  sortedCategoryItems = sortedCategoryItems?.map(item => {
    return {
      ...item,
      percentage: Math.round(
        (parseInt(item.current_fytd_rcpt_outly_amt, 10) / total) * 100
      ),
    }
  })

  const firstTen = sortedCategoryItems?.slice(0, 10)
  const other = sortedCategoryItems?.slice(10)
  const otherTotal = other
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)
  const otherPercentage = Math.round((otherTotal / total) * 100)
  console.log(firstTen, "FIRST TEN")
  return (
    <MuiThemeProvider theme={theme}>
      <Card
        data-testid="highlight-card"
        style={{ background: "grey" }}
        className={card}
      >
        {firstTen?.map(item => {
          return (
            <div style={{ display: "flex" }}>
              <div
                style={{
                  background: "#00766C",
                  width: `${item.percentage * 20}px`,
                }}
              ></div>
              <div>{item.percentage} %</div>
              <div>{item.classification_desc} </div>
            </div>
          )
        })}
        <div style={{ display: "flex" }}>
          <div
            style={{
              background: "#00766C",
              width: `${otherPercentage * 20}px`,
            }}
          ></div>
          <div>{otherPercentage} %</div>
          <div>Other </div>
        </div>
      </Card>
    </MuiThemeProvider>
  )
}

export default withStyles(cardStyles)(HowMuchDoesTheGovtSpend)
