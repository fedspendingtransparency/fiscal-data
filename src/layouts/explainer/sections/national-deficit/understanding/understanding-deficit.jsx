import {
  understandingDeficitContainer,
  textContent
} from "./understanding-deficit.module.scss";
import {deficitExplainerPrimary} from "../national-deficit.module.scss";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React, {useEffect, useState} from "react";
import 'react-tabs/style/react-tabs.css';
import SurplusIllustration from "./surplus-illustration/surplus-illustration";
import DeficitComparisonBarChart from "./deficit-comparison-bar-chart/deficit-comparison-bar-chart";
import GlossaryTerm from "../../../../../components/glossary-term/glossary-term";
import {apiPrefix, basicFetch} from "../../../../../../src/utils/api-utils";
import {nationalDeficitSectionConfigs} from "../../national-deficit/national-deficit";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../src/utils/date-utils";


const UnderstandingDeficit = ({sectionId, glossary}) => {
  const spending =
    <GlossaryTerm term={'spending'} page={'Deficit Explainer'} glossary={glossary}>
      spending
    </GlossaryTerm>


  const revenue =
    <GlossaryTerm term={'revenue'} page={'Deficit Explainer'} glossary={glossary}>
      revenue
    </GlossaryTerm>

  const surplus =
    <GlossaryTerm term={'surplus'} page={'Deficit Explainer'} glossary={glossary}>
      surplus
    </GlossaryTerm>

    const [date, setDate] = useState(new Date ());
    const [lastFiscalYear, setLastFiscalYear] = useState(0);
    const [deficitValue, setDeficitValue] = useState(0);
    const [deficitLabel, setDeficitLabel] = useState("");
    const [deficitChangeValue, setDeficitChangeValue] = useState(0);
    const [deficitChangeLabel, setDeficitChangeLabel] = useState("");
    const [revenueValue, setRevenueValue] = useState(0);
    const [revenueLabel, setRevenueLabel] = useState("");
    const [spendingValue, setSpendingValue] = useState(0);
    const [spendingLabel, setSpendingLabel] = useState("");
    const [data, setData] = useState(null);

    const {
      name,
      slug,
      endpoints
    } = nationalDeficitSectionConfigs[sectionId];

  const dateEndpoint = endpoints[0];
  const deficitEndpoint = endpoints[1];
  const revenueEndpoint = endpoints[2];
  const spendingEndpoint = endpoints[3];
  const deficitChangeEndpoint = endpoints[4];



  useEffect(() => {
    basicFetch(`${apiPrefix}${dateEndpoint.path}`)
      .then(response => {
        setDate(getDateWithoutTimeZoneAdjust(response.data[0][dateEndpoint.dateField]));
        setLastFiscalYear(response.data[0][dateEndpoint.valueField]);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitEndpoint.valueField]);
        setDeficitValue(value);
        setDeficitLabel((value / 1000000000000).toFixed(2));
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${revenueEndpoint.path}`)
      .then(response => {
        const value = response.data[0][revenueEndpoint.valueField];
        setRevenueValue(value);
        setRevenueLabel((value / 1000000000000).toFixed(2));
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${spendingEndpoint.path}`)
      .then(response => {
        const value = response.data[0][spendingEndpoint.valueField];
        setSpendingValue(value);
        setSpendingLabel((value / 1000000000000).toFixed(2));

      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitChangeEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitChangeEndpoint.valueField]);
        setDeficitChangeValue(value);
      });
  }, []);

  if(!data && deficitValue && revenueValue && spendingValue && deficitChangeValue) {
    const deficitDifference = Math.abs(deficitValue - deficitChangeValue);
    let deficitDifferenceText = '';

    if(deficitDifference >= 1000000000000) {
      deficitDifferenceText =`$${(deficitDifference / 1000000000000).toFixed(2)} trillion`
    } else {
      deficitDifferenceText =`$${(deficitDifference / 1000000000).toFixed(2)} billion`
    }

    if(deficitValue > deficitChangeValue) {
      setDeficitChangeLabel(
        `an increase of ${deficitDifferenceText}`);
    } else if(deficitValue < deficitChangeValue) {
      setDeficitChangeLabel(
        `a decrease of ${deficitDifferenceText}`);
    } else {
      setDeficitChangeLabel('not changed');
    }

    setData(
      [
        {
          id: 0,
          revenue: revenueValue,
          deficit: deficitValue
        },
        {
          id: 1,
          spending: spendingValue
        }
      ]
    );
  }

  return (
  <div className={understandingDeficitContainer}>
    <div className={visWithCallout}>
      <div className={textContent} data-testid={'textContent'}>
        <p>
          A budget deficit occurs when money going out ({spending}) exceeds money coming in
          ({revenue}) during a defined period. In FY {lastFiscalYear},
          the federal government spent ${spendingLabel} trillion and collected ${revenueLabel} trillion in revenue,
          resulting in a deficit. The amount by which spending exceeds revenue, ${deficitLabel} trillion
          in {lastFiscalYear}, is referred to as deficit spending.
        </p>
        <p>
          The opposite of a budget deficit is a budget {surplus}, which occurs when the federal
          government collects more money than it spends. The U.S. has experienced a fiscal year-end
          budget surplus five times in the last 50 years, most recently in 2001.
        </p>
        <p>
          When there is no deficit or surplus due to spending and revenue being equal,
          the budget is considered balanced.
        </p>
      </div>
      <VisualizationCallout color={deficitExplainerPrimary} textWithCallout={true}>
        <p>
          The terms “national deficit”, “federal deficit” and “U.S. deficit” have the same meaning
          and are used interchangeably by the U.S. Treasury.
        </p>
      </VisualizationCallout>
    </div>
    <SurplusIllustration glossary={glossary}/>
    <p>
      The chart below shows a breakdown of how the U.S. deficit compares to the corresponding
      revenue and spending.
    </p>
    <DeficitComparisonBarChart sectionId={sectionId} />
  </div>
)};

export default UnderstandingDeficit;
