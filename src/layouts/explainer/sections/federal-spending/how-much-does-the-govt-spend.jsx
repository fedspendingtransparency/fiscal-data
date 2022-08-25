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
import {
  footerStyle,
  headerContainer,
  headerStyle,
  subHeader,
  column,
  chartsContainer,
  percentOrDollarContainer,
  descContainer,
  chartToggle,
  toggleButton,
} from "./how-much-does-the-govt-spend.module.scss"
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
        onColor="#00766C"
        onHandleColor="#00766C"
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

const HowMuchDoesTheGovtSpend = () => {
  const [chartData, setChartData] = useState(null)
  const [selectedChartView, setSelectedChartView] = useState("category")
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
    <div className={footerStyle}>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore
      and download this data.
    </div>
  )

  const header = (
    <div className={headerContainer}>
      <div className={headerStyle}>U.S. Government Spending, FY 2021</div>
      <div className={subHeader}>Top 10 Spending by Category and Agency</div>
    </div>
  )
  const sortField =
    selectedChartView === "category"
      ? "current_fytd_rcpt_outly_amt"
      : "current_fytd_app_rcpt_amt"
  let sortedItems =
    chartData &&
    chartData[selectedChartView]?.data.sort((a, b) => {
      return b[sortField] - a[sortField]
    })

  const total = sortedItems
    ?.map(item => parseInt(item[sortField], 10))
    ?.reduce((a, b) => a + b)

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round((parseInt(item[sortField], 10) / total) * 100),
      dollarAmount: parseInt(item[sortField]),
    }
  })

  console.log(sortedItems, "SORTED ITEMS")

  const firstTen = sortedItems?.slice(0, 10)
  const other = sortedItems?.slice(10)

  const otherTotal = other
    ?.map(item => parseInt(item[sortField], 10))
    ?.reduce((a, b) => a + b)
  const otherPercentage = Math.round((otherTotal / total) * 100)
  // TODO:  styling: (box shadow on toggle)
  // test responsiveness/text-wrapping,
  // check all heights against the mockups
  //  clean up layouts
  return (
    <ChartContainer
      customContainerStyles={{
        flexDirection: "column",
        marginLeft: "0px",
        maxWidth: "100%",
      }}
      header={header}
      footer={footer}
      date={new Date()}
    >
      <div className={chartToggle}>
        <button
          className={toggleButton}
          style={{
            borderBottomLeftRadius: "4px",
            borderTopLeftRadius: "4px",
            color: selectedChartView === "category" ? "white" : "#00766C",
            background: selectedChartView === "category" ? "#00766C" : "white",
            borderRight: "none",
          }}
          onClick={() => {
            setSelectedChartView("category")
          }}
        >
          Category
        </button>
        <button
          className={toggleButton}
          style={{
            borderBottomRightRadius: "4px",
            borderTopRightRadius: "4px",
            color: selectedChartView === "agency" ? "white" : "#00766C",
            background: selectedChartView === "agency" ? "#00766C" : "white",
          }}
          onClick={() => {
            setSelectedChartView("agency")
          }}
        >
          Agency
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "48px",
        }}
      >
        <span
          style={{
            fontWeight: !percentDollarToggleChecked ? "bold" : "inherit",
            marginRight: "4px",
            color: "#00766C",
          }}
        >
          Percent
        </span>
        <ToggleSwitch
          checked={percentDollarToggleChecked}
          handleChange={e => {
            setPercentDollarToggleChecked(e)
          }}
        ></ToggleSwitch>
        <span
          style={{
            fontWeight: percentDollarToggleChecked ? "bold" : "inherit",
            marginLeft: "4px",
            color: "#00766C",
            marginBottom: "24px",
          }}
        >
          Dollars
        </span>
      </div>
      {firstTen?.map(item => {
        return (
          <div className={chartsContainer}>
            <div
              style={{
                background: "#00766C",
                width: `${item.percentage * 3}%`,
                marginRight: "16px",
                height: "55px",
              }}
            ></div>
            <div className={percentOrDollarContainer}>
              {percentDollarToggleChecked
                ? `${capitalizeLastLetter(
                    numeral(item.dollarAmount).format("($ 0.00 a)")
                  )}`
                : `${item.percentage} %`}
            </div>
            <div className={descContainer}>
              {item.classification_desc?.replace("Total--", "")}
            </div>
          </div>
        )
      })}
      <div className={chartsContainer}>
        <div
          style={{
            background: "#00766C",
            width: `${otherPercentage * 3}%`,
            marginRight: "16px",
            height: "55px",
          }}
        ></div>
        <div className={percentOrDollarContainer}>
          {percentDollarToggleChecked
            ? `${capitalizeLastLetter(
                numeral(otherTotal).format("($ 0.00 a)")
              )}`
            : `${otherPercentage} %`}
        </div>
        <div className={descContainer}>Other </div>
      </div>
    </ChartContainer>
  )
}

export default withStyles(cardStyles)(HowMuchDoesTheGovtSpend)
