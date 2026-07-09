import React, { FunctionComponent, useState } from 'react';
import Analytics from '../../utils/analytics/analytics';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { IDataset } from '../../models/IDataset';
import { card, card_withFocus, card_withFocus_FireFox, cardHeroImage, datasetName } from './dataset-card.module.scss';
import DatasetStats from './dataset-stats/dataset-stats';
import { isFirefox } from 'react-device-detect';
import { ga4DataLayerPush } from '../../helpers/google-analytics/google-analytics-helper';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

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

  const { allFile } = useStaticQuery(
    graphql`
      query {
        allFile(filter: { sourceInstanceName: { eq: "dataset-search-hero-images" } }) {
          heroImages: nodes {
            name
            childImageSharp {
              gatsbyImageData(quality: 100, placeholder: NONE)
            }
          }
        }
      }
    `
  );

  console.log(allFile.heroImages[0]);

  const assignHeroImage = () => {
    switch (dataset.heroNumber) {
      case 0:
        return allFile.heroImages[0];
      case 1:
        return allFile.heroImages[1];
      case 2:
        return allFile.heroImages[2];
      case 3:
        return allFile.heroImages[3];
      case 4:
        return allFile.heroImages[4];
      case 5:
        return allFile.heroImages[5];
      case 6:
        return allFile.heroImages[6];
      case 7:
        return allFile.heroImages[7];
      case 8:
        return allFile.heroImages[8];
    }
  };

  const clickHandler = (e: React.MouseEvent): void => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
      return;
    }
    if (context && referrer) {
      if (explainer) {
        Analytics.event({
          category: `Explainers`,
          action: `${referrer} Citation Click`,
          label: dataset.name,
        });
        // GA4 Data Layer - Dataset Click
        ga4DataLayerPush({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: `${dataset.name}`,
        });
        // GA4 Data Layer - Clear
        (window as any).dataLayer.push({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: undefined,
        });
      } else if (context === 'Dataset Search Page') {
        Analytics.event({
          category: `${context}`,
          action: `${context} Click`,
          label: dataset.name,
        });
        // GA4 Data Layer - Dataset Click
        ga4DataLayerPush({
          event: `${context} Click`,
          eventLabel: `from ${referrer} to ${dataset.name}`,
        });
      } else {
        Analytics.event({
          category: `${context} Click`,
          action: `Related Dataset Click`,
          label: dataset.name,
        });
        // GA4 Data Layer - Dataset Click
        ga4DataLayerPush({
          event: `${context} Click`,
          eventLabel: `from ${referrer} to ${dataset.name}`,
        });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card className={applyFocusStyle ? focusStyle : card} id={explainer ? dataset.name : null}>
        <CardActionArea
          component={Link}
          to={cardLink}
          onClick={clickHandler}
          onFocus={() => setApplyFocusStyle(true)}
          onBlur={() => setApplyFocusStyle(false)}
          style={{ padding: 0 }}
        >
          <div>
            <GatsbyImage alt="hero" image={getImage(assignHeroImage())} className={cardHeroImage} />
            <div className={datasetName}>{dataset.name}</div>
          </div>
          <DatasetStats dataset={dataset} />
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
};

export default DatasetCard;
