import React, {FunctionComponent, useState} from 'react';
import Analytics from '../../utils/analytics/analytics';
import { navigate } from "gatsby";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "../../theme";
import { IDataset } from '../../models/IDataset';
import {
  card,
  card_headerLink,
  card_tagLine,
  card_link,
  card_withFocus,
  card_withFocus_FireFox,
} from './dataset-card.module.scss';
import DatasetStats from "./dataset-stats/dataset-stats";
import Truncator from '../truncate/truncate';
import DatasetTopicsSummary from './dataset-topics-summary/dataset-topics-summary';
import { isFirefox } from 'react-device-detect';


type DatasetCardProps = {
  dataset: IDataset,
  context: string,
  referrer: string,
  explainer?: boolean,
}

const DatasetCard: FunctionComponent<DatasetCardProps> = ({
  dataset,
  context,
  referrer,
  explainer,
}) => {
  const cardLink = `/datasets${dataset.slug}`;
  const [applyFocusStyle, setApplyFocusStyle] = useState(false);
  const focusStyle = isFirefox ? card_withFocus_FireFox : card_withFocus;


  const clickHandler: () => void = () => {
    if (context && referrer) {

      if (explainer) {
        Analytics.event({
          category: `Explainers`,
          action: 'Citation Click',
          label: `${referrer} - ${context}`
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': `${referrer} - Citation Click`,
          'citationClickEventLabel': `${dataset.name}`,
        });
        // GA4 Data Layer - Clear
        (window as any).dataLayer.push({
          'event': `${referrer} - Citation Click`,
          'citationClickEventLabel': undefined,
        });
      }
      else {
        Analytics.event({
          category: `${context} Click`,
          action: `from ${referrer}`,
          value: dataset.name
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': `${context} Click`,
          'eventLabel': `from ${referrer} to ${dataset.name}`,
        });
      }
    }
    navigate(cardLink);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={applyFocusStyle ? focusStyle : card} onClick={clickHandler} id={explainer ? dataset.name : null}>
        <CardActionArea
          onFocus={() => setApplyFocusStyle(true)}
          onBlur={() => setApplyFocusStyle(false)}
        >
          <div className={card_headerLink}>
            <Truncator>{dataset.name}</Truncator>
          </div>
          <div className={card_tagLine}>
            <Truncator>{dataset.tagLine}</Truncator>
          </div>
          <DatasetStats dataset={dataset} />
          <DatasetTopicsSummary relatedTopics={dataset.relatedTopics} />
          <span className={card_link}>Dataset Details</span>
        </CardActionArea>
      </Card>
    </MuiThemeProvider>
  )
}

export default DatasetCard;
