import React, { FunctionComponent, useState } from 'react';
import Analytics from '../../utils/analytics/analytics';
import { navigate } from 'gatsby';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../../theme';
import { IDataset } from '../../models/IDataset';
import { card, card_withFocus, card_withFocus_FireFox, cardHeroImage, datasetName } from './dataset-card.module.scss';
import DatasetStats from './dataset-stats/dataset-stats';
import { isFirefox } from 'react-device-detect';
import heroImage from '../../../static/images/dataset-search-hero-images/Hero-8.png';

console.log(heroImage);

type DatasetCardProps = {
  dataset: IDataset;
  context: string;
  referrer: string;
  explainer?: boolean;
};

const DatasetCard: FunctionComponent<DatasetCardProps> = ({ dataset, context, referrer, explainer }) => {
  const cardLink = `/datasets${dataset.slug}`;
  const [applyFocusStyle, setApplyFocusStyle] = useState(false);
  const focusStyle = isFirefox ? card_withFocus_FireFox : card_withFocus;

  const clickHandler: () => void = () => {
    if (context && referrer) {
      if (explainer) {
        Analytics.event({
          category: `Explainers`,
          action: 'Citation Click',
          label: `${referrer} - ${context}`,
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: `${dataset.name}`,
        });
        // GA4 Data Layer - Clear
        (window as any).dataLayer.push({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: undefined,
        });
      } else {
        Analytics.event({
          category: `${context} Click`,
          action: `from ${referrer}`,
          value: dataset.name,
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: `${context} Click`,
          eventLabel: `from ${referrer} to ${dataset.name}`,
        });
      }
    }
    navigate(cardLink);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={applyFocusStyle ? focusStyle : card} onClick={clickHandler} id={explainer ? dataset.name : null}>
        <CardActionArea onFocus={() => setApplyFocusStyle(true)} onBlur={() => setApplyFocusStyle(false)} style={{ padding: 0 }}>
          <div>
            <img src={heroImage} alt={'hero'} className={cardHeroImage} />
            <div className={datasetName}>{dataset.name}</div>
          </div>
          <DatasetStats dataset={dataset} />
        </CardActionArea>
      </Card>
    </MuiThemeProvider>
  );
};

export default DatasetCard;
