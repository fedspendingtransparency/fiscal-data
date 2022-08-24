import React, { useState, useEffect, FunctionComponent } from "react"
import Card from "@material-ui/core/Card"
import { MuiThemeProvider } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { theme } from "../../../../theme"
import { apiPrefix, basicFetch } from "../../../../utils/api-utils"
import { card } from "../../../../components/home-highlight-cards/home-highlight-cards.module.scss"
import formatCurrency from "../national-deficit/deficit-by-year/deficit-trends-bar-chart/deficit-trends-bar-chart"
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
  const type = "category"

  let sortedItems = chartData[type]?.data.sort((a, b) => {
    return b.current_fytd_rcpt_outly_amt - a.current_fytd_rcpt_outly_amt
  })

  const total = sortedItems
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)

  // logic for toggling percentage/dollars here

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round(
        (parseInt(item.current_fytd_rcpt_outly_amt, 10) / total) * 100
      ),
      dollarAmount: formatCurrency(parseInt(item.current_fytd_rcpt_outly_amt)),
    }
  })

  console.log(sortedItems, "s")

  const firstTen = sortedItems?.slice(0, 10)
  const other = sortedItems?.slice(10)
  const otherTotal = other
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)
  const otherPercentage = Math.round((otherTotal / total) * 100)
  return (
    <MuiThemeProvider theme={theme}>
      <Card
        data-testid="highlight-card"
        style={{
          background: "#f1f1f1",
          padding: "48px",
          paddingLeft: "16px",
          paddingTop: "16px",
        }}
        className={card}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ color: "#555555", fontSize: "18px", fontWeight: "bold" }}
          >
            U.S. Government Spending, FY 2021
          </div>
          <div
            style={{ color: "#2A328C", fontSize: "16px", marginBottom: "48px" }}
          >
            Top 10 Spending by Category and Agency
          </div>
        </div>
        {firstTen?.map(item => {
          return (
            <div
              style={{
                display: "flex",
                marginBottom: "16px",
                marginLeft: "36px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "#00766C",
                  width: `${item.percentage * 11}px`,
                  marginRight: "16px",
                  height: "55px",
                }}
              ></div>
              <div
                style={{
                  marginRight: "8px",
                  color: "#2A328C ",
                  fontWeight: "bold",
                }}
              >
                {item.percentage} %
              </div>
              <div style={{ marginRight: "16px" }}>
                {item.classification_desc}
              </div>
            </div>
          )
        })}
        <div
          style={{
            display: "flex",
            marginRight: "16px",
            marginLeft: "36px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#00766C",
              width: `${otherPercentage * 11}px`,
              marginRight: "16px",
              height: "55px",
            }}
          ></div>
          <div
            style={{
              marginRight: "8px",
              color: "#2A328C ",
              fontWeight: "bold",
            }}
          >
            {otherPercentage} %
          </div>
          <div style={{ marginRight: "16px" }}>Other </div>
        </div>
      </Card>
    </MuiThemeProvider>
  )
}

export default withStyles(cardStyles)(HowMuchDoesTheGovtSpend)
