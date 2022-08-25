import React, { useState, useEffect, FunctionComponent } from "react"
import Card from "@material-ui/core/Card"
import { MuiThemeProvider } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { theme } from "../../../../theme"
import { apiPrefix, basicFetch } from "../../../../utils/api-utils"
import { card } from "../../../../components/home-highlight-cards/home-highlight-cards.module.scss"
import Switch from "react-switch"
import numeral from "numeral"
import CustomLink from "../../../../components/links/custom-link/custom-link"
import ChartContainer from "../../explainer-components/chart-container/chart-container"
const cardStyles = {
  root: {
    fontSize: "1rem",
    background: "darkgrey",
  },
}
export const capitalizeLastLetter = word => {
  const parts = word.split("")
  const last = word[parts.length - 1].toUpperCase()
  parts[parts.length - 1] = last
  return parts.join("")
}

export const ToggleSwitch = ({ checked, handleChange }) => {
  return (
    <label htmlFor="material-switch">
      <Switch
        checked={checked}
        onChange={handleChange}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={15}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20}
        width={48}
        className="react-switch"
        id="material-switch"
      />
    </label>
  )
}

const HowMuchDoesTheGovtSpend = ({ type = "category" }) => {
  const [chartData, setChartData] = useState(null)
  const [percentDollarToggleChecked, setPercentDollarToggleChecked] = useState(
    false
  )
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

  const name = "Monthly Treasury Statement (MTS)"
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`
  const footer = (
    <div style={{ marginTop: "32px", marginBottom: "16px" }}>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore
      and download this data.
    </div>
  )

  const header = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ color: "#555555", fontSize: "18px", fontWeight: "bold" }}>
        U.S. Government Spending, FY 2021
      </div>
      <div style={{ color: "#2A328C", fontSize: "16px", marginBottom: "48px" }}>
        Top 10 Spending by Category and Agency
      </div>
    </div>
  )
  let sortedItems =
    chartData &&
    chartData[type]?.data.sort((a, b) => {
      return b.current_fytd_rcpt_outly_amt - a.current_fytd_rcpt_outly_amt
    })

  const total = sortedItems
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round(
        (parseInt(item.current_fytd_rcpt_outly_amt, 10) / total) * 100
      ),
      dollarAmount: parseInt(item.current_fytd_rcpt_outly_amt),
    }
  })

  const firstTen = sortedItems?.slice(0, 10)
  const other = sortedItems?.slice(10)
  const otherTotal = other
    ?.map(item => parseInt(item.current_fytd_rcpt_outly_amt, 10))
    ?.reduce((a, b) => a + b)
  const otherPercentage = Math.round((otherTotal / total) * 100)
  // TODO:  clean up in-line styling, placeholder for switch at the top, test responsiveness
  // callout??
  return (
    <ChartContainer
      customContainerStyles={{ flexDirection: "column" }}
      header={header}
      footer={footer}
      date={new Date()}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ToggleSwitch
            checked={percentDollarToggleChecked}
            handleChange={e => {
              setPercentDollarToggleChecked(e)
            }}
          ></ToggleSwitch>
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
                minWidth: "80px",
              }}
            >
              {percentDollarToggleChecked
                ? `${capitalizeLastLetter(
                    numeral(item.dollarAmount).format("($ 0.00 a)")
                  )}`
                : `${item.percentage} %`}
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
            minWidth: "80px",
          }}
        >
          {percentDollarToggleChecked
            ? `${capitalizeLastLetter(
                numeral(otherTotal).format("($ 0.00 a)")
              )}`
            : `${otherPercentage} %`}
        </div>
        <div style={{ marginRight: "16px" }}>Other </div>
      </div>
    </ChartContainer>
  )
}

export default withStyles(cardStyles)(HowMuchDoesTheGovtSpend)
