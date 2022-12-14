import React, { FunctionComponent } from "react";
import Analytics from '../../utils/analytics/analytics';
import { Link, navigate } from "gatsby";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "../../theme";
import { IDataset } from '../../models/IDataset';
import {
  card,
  card_headerLink,
  card_tagLine,
  card_link
} from './dataset-card.module.scss';
import DatasetStats from "./dataset-stats/dataset-stats";
import Truncator from '../truncate/truncate';
import DatasetTopicsSummary from './dataset-topics-summary/dataset-topics-summary';

type DatasetCardProps = {
  dataset: IDataset,
  context: string,
  referrer: string,
  explainer?: boolean
}

const DatasetCard: FunctionComponent<DatasetCardProps> = ({
  dataset,
  context,
  referrer,
  explainer
}) => {
  const cardLink = `/datasets${dataset.slug}`;

  const clickHandler: () => void = () => {
    if (context && referrer) {
      explainer ?
        Analytics.event({
          category: `Explainers`,
          action: 'Citation Click',
          label: `${referrer} - ${context}`
        }) :
        Analytics.event({
          category: `${context} Click`,
          action: `from ${referrer}`,
          value: dataset.name
        })
    }

    navigate(cardLink);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={card} onClick={clickHandler}>
        <CardActionArea>
          <Link
            to={cardLink}
            className={card_headerLink}
            title={dataset.name}
          >
            <Truncator>{dataset.name}</Truncator>
          </Link>
          <div className={card_tagLine}>
            <Truncator>{dataset.tagLine}</Truncator>
          </div>
          <DatasetStats dataset={dataset} />
          <DatasetTopicsSummary relatedTopics={dataset.relatedTopics} />
          <Link to={cardLink} className={card_link}>Dataset Details</Link>
        </CardActionArea>
      </Card>
    </MuiThemeProvider>
  )
}

export default DatasetCard;
