import React, { useState, useEffect, FunctionComponent } from "react"
import { Link } from "gatsby";
import Card from '@material-ui/core/Card';
import { MuiThemeProvider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner, faTable } from "@fortawesome/free-solid-svg-icons"
import { format } from 'date-fns';
import Analytics from "../../../utils/analytics/analytics";
import { fetchHighlights } from '../../../utils/api-utils';
import drawSparkline, { addHoverEffects, removeHoverEffects } from '../../charts/chart-sparkline';
import globalConstants from "../../../helpers/constants";
import { theme } from "../../../theme";
import {
  card,
  cardActionArea,
  cardContent,
  cardHeaderLink,
  datasetArrow,
  datasetLineLink,
  datasetIcon,
  datasetName,
  header,
  highlightLink,
  imageContainer,
  sparkLine,
  statsContainer,
  statDate,
  statLower,
  statUpper,
  viewDataset,
  xAxis
} from './home-highlight-card.module.scss';
import { IDatasetApi } from "../../../models/IDatasetApi";
import { IDataset } from "../../../models/IDataset";
import { DatasetFieldDataType } from "../../../models/fdg-types";
import { formatCardValue } from "../home-highlight-cards-helper/home-highlight-cards-helper";
import BarGraph from '../../charts/bar/bar';
import Sparkler from "./sparkler/sparkler"
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const cardStyles = {
  root: {
    fontSize: '1rem',
  }
};

interface ApiData {
  data?: [{ [key: string]: string }],
  meta?: { [key: string]: string | Record<string, unknown> }
}
interface Stats {
  upperDate: string,
  lowerDate: string,
  format: DatasetFieldDataType,
  value: number
}
type HighlightCardProps = {
  cardId?: string,
  dataset: IDataset,
  cardButtonOverrides: any,
  hidden: boolean,
  primary: boolean,
  title: string,
  mainHighlightValue: number,
  mainHighlightValueDataType: DatasetFieldDataType,
  visual: Record<string, unknown>
};

const HomeHighlightCard: FunctionComponent<HighlightCardProps> = ({ cardId, dataset, hidden }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ApiData>({});
  const [hoverDelayHandler, setHoverDelayHandler] =  useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [chartHoverDelayHandler, setChartHoverDelayHandler] =  useState(null);
  const [graphType, setGraphType] = useState('LINE');
  const [stats, setStats] = useState<Stats>({
    upperDate: 'Jan XXXX',
    lowerDate: 'Jan XXXX',
    format: 'NUMBER',
    value: null
  });
  const [tempValue, setTempValue] = useState(null);
  const [tempDate, setTempDate] = useState(null);

  const { data, title, name, slug, apis, displayOrder } = dataset;
  const api: IDatasetApi = apis.find(api => api.apiId === data.api_id);
  let cardSlug = `/datasets${slug}`;
  if(api && api.pathName) {
    cardSlug += api.pathName;
  }
  const ANALYTICS_EVENT_DELAY: number = globalConstants.config
    .homepage.highlightAnalyticsHoverDelay;
  const ANALYTICS_CARD_ACTION: string = globalConstants.config
    .homepage.analyticsActions.card;
  const ANALYTICS_CHART_ACTION: string = globalConstants.config
    .homepage.analyticsActions.chart;
  const ANALYTICS_CLICK_ACTION: string = globalConstants.config
    .homepage.analyticsActions.click;

  const getApiData = async () => {
    const dateField = (api ? api.dateField : '');
    const sorts = data?.sorts ? data.sorts : undefined;
    if (api) {
      fetchHighlights(
        api.endpoint,
        data.filters,
        data.fields,
        dateField,
        data.limit,
        sorts,
        data.noRecordDateInFields
      ).then(res => {
        res.data = res.data.sort((a, b) => {
          const aDate = a[dateField];
          const bDate = b[dateField];
          if (aDate && bDate) {
            return aDate.localeCompare(bDate);
          }
          if (aDate) {
            return 1;
          } else if(bDate){
            return -1;
          }
          return 0;
        });

        if (data.transform) {
          res.data = data.transform.call(data, res);
        }
        setApiData(res);
      })
        .catch(err => {
          console.error('API error', err);
          setApiError(err)
        })
        .finally(() => setIsLoading(false));
    }
  };

  const formatDateString = (dateString: string): string => {
    return format(new Date(dateString.replace(/-/g, '/')), 'MMM yyyy');
  };

  const analyticsEvent: (string) => void = (action: string) => {
    Analytics.event({
      category: 'Fiscal Data - Homepage Cards',
      action: `${action}`,
      label: `${title}`
    });

    if(action && title) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'event': action,
        'eventLabel': title,
      });
    }
  };

  const setTempValueAndDate = (v, d) => {
    setTempValue(v);
    setTempDate(d);
  };

  const handleCardMouseOver: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>
  ) => void = (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const { target } = event;
    if (target['id'] === `chart-${displayOrder}`) {
      if (graphType === 'LINE') {
        addHoverEffects(
          apiData.data,
          `chart-${displayOrder}`,
          (api ? api.dateField : ''),
          data.fields[0],
          setTempValueAndDate
        );
      }

      if (!chartHoverDelayHandler) {
        handleCardLeave();
        setChartHoverDelayHandler(setTimeout(() => {
          analyticsEvent(ANALYTICS_CHART_ACTION);
          setChartHoverDelayHandler(null);
        }, ANALYTICS_EVENT_DELAY));
      }
    } else if (!hoverDelayHandler) {
      // For bar charts, check that the target is not a chart component
      if (graphType !== 'BAR' || (target['nodeName'] !== 'rect' && target['nodeName'] !== 'svg')) {
        handleChartMouseLeave();
        setHoverDelayHandler(setTimeout(() => {
          analyticsEvent(ANALYTICS_CARD_ACTION);
          setHoverDelayHandler(null);
        }, ANALYTICS_EVENT_DELAY));

      }
    }
  };

  const barChartMouseEnter: () => void = () => {
    if (!chartHoverDelayHandler) {
      handleCardLeave();
      setChartHoverDelayHandler(setTimeout(() => {
        analyticsEvent(ANALYTICS_CHART_ACTION);
        setChartHoverDelayHandler(null);
      }, ANALYTICS_EVENT_DELAY));

    }
  };

  const handleMouseLeave: () => void = () => {
    handleCardLeave();
    handleChartMouseLeave();
  };

  const handleCardLeave: () => void = () => {
    if (hoverDelayHandler) {
      clearTimeout(hoverDelayHandler);
      setHoverDelayHandler(null);
    }
  };

  const handleChartMouseLeave: () => void = () => {
    if (chartHoverDelayHandler) {
      clearTimeout(chartHoverDelayHandler);
      setChartHoverDelayHandler(null);
    }

    if (graphType === 'LINE') {
      removeHoverEffects();
    }
  };

  const handleClick: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>
  ) => void = () => {
    handleMouseLeave();
    analyticsEvent(ANALYTICS_CLICK_ACTION);
  };

  const displayValue = (datatype: DatasetFieldDataType, value: number) => {
    let label = '';

    if (datatype === 'CURRENCY_NET') {
      label = 'Net: ';
    }

    return formatCardValue(value, label, datatype)
  };

  const loadCardData = () => {
    if(!hidden && !hasLoaded){
      setHasLoaded(true);
      getApiData();
    }
  };

  useEffect(() => {
    loadCardData();
  }, [hidden]);

  useEffect(() => {
    setGraphType(data.chartType);
  }, []);

  useEffect(() => {
    if (apiData.data && apiData.data.length) {

      const statField = data['valueField'] || data.fields[0];

      const first = apiData.data[0];

      let firstDate = `${first[`${(api ? api.dateField : '')}`]}`;

      const last = apiData.data[apiData.data.length - 1];
      const lastValue = Number(last.chartedValue || last[`${statField}`]);
      let lastDate = last[`${(api ? api.dateField : '')}`];

      // Swap dates as needed
      if(firstDate > lastDate){
        const tempDate = firstDate;
        firstDate = lastDate;
        lastDate = tempDate;
      }

      const upperDate: string = formatDateString(lastDate);
      const lowerDate: string = formatDateString(firstDate);

      setStats({
        upperDate,
        lowerDate,
        format: data.format || stats.format,
        value: lastValue
      });

      const showXLabel = true;
      if (graphType === 'LINE') {
        drawSparkline(
          apiData.data,
          `chart-${displayOrder}`,
          (api ? api.dateField : ''),
          data.fields[0],
          showXLabel,
          lowerDate,
          upperDate
        );
      }
    }
  }, [apiData, dataset]);

  const value: number = tempValue !== null ? tempValue : stats.value;
  const date: string = tempDate !== null ? formatDateString(tempDate) : stats.upperDate;

  return (
    <MuiThemeProvider theme={theme}>
      <Card data-testid="highlight-card"
            className={card}
      >
        <div className={cardActionArea}>
          <div className={cardContent}>
            <div
              data-testid="highlight-title"
              className={`${header} ${cardHeaderLink}`}
            >
              {title}
            </div>
            {graphType === 'IMAGE' && (
              <div
                id={`chart-${displayOrder}`}
                className={imageContainer}
                data-testid="image-container"
                onMouseEnter={handleCardMouseOver}
                onMouseLeave={handleChartMouseLeave}
                role={'presentation'}
              >
                {isLoading ?
                  <div data-testid="loadingSection">
                    <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
                    Loading...
                  </div> :
                  <div style={{position: 'relative'}}>
                    <img
                      src={data.image.src}
                      alt={data.image.alt}
                    />
                    {data.image.sparklePoints && (
                      <Sparkler coordinates={data.image.sparklePoints} />
                    )}
                  </div>
                }
              </div>
            )}
            {graphType === 'LINE' && (
              <div
                id={`chart-${displayOrder}`}
                data-testid="highlight-chart"
                className={sparkLine}
                onMouseEnter={handleCardMouseOver}
                onMouseLeave={handleChartMouseLeave}
                role={'presentation'}
              >
                {apiError && <p>API Error</p>}
                {isLoading &&
                <div data-testid="loadingSection">
                  <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
                  Loading...
                </div>
                }
              </div>
            )}
            {graphType === 'BAR' && (
              <div
                id={`chart-${displayOrder}`}
                data-testid="highlight-chart"
                className={sparkLine}
                onMouseEnter={handleCardMouseOver}
                onMouseLeave={handleChartMouseLeave}
                role={'presentation'}
              >
                <BarGraph
                  cardId={cardId}
                  graphData={apiData.data as [{[key: string]: string | number }]}
                  graphIndex={data.index}
                  valueKeys={data.value_fields}
                  colors={data.colors || null}
                  isInteractive={false}
                  setTempValue={setTempValue}
                  setTempDate={setTempDate}
                  dateField={(api ? api.dateField : '')}
                  useCustomBarComponent
                  mouseEnter={barChartMouseEnter}
                />
                <div className={xAxis}>
                  <div data-testid="highlight-stats" className={statsContainer}>
                    <div data-testid="highlight-stats-lower" className={statLower}>
                      <span className={statDate}>
                        {stats.lowerDate}
                      </span>
                    </div>
                    <div data-testid="highlight-stats-upper" className={statUpper}>
                      <span className={statDate}>
                        {stats.upperDate}
                      </span>
                    </div>
                  </div>
                </div>
                {apiError && <p>API Error</p>}
                {isLoading &&
                <div data-testid="loadingSection">
                  <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
                  Loading...
                </div>
                }
              </div>
            )}
            <div
              data-testid="highlight-name"
              className={datasetName}
              title={name}
            >
              <FontAwesomeIcon icon={faTable as IconProp} className={datasetIcon} />
              {name}
            </div>
            <div data-testid="highlight-hero-value">
              {displayValue(stats.format, value)}
            </div>
            <div data-testid="highlight-hero-value-date" className={statDate}>
              {date}
            </div>
          </div>
        </div>
        <Link
          to={cardSlug}
          tabIndex={hidden ? -1 : 0}
          onMouseOver={handleCardMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className={highlightLink}
          data-testid="highlight-link"
        >
          <div className={datasetLineLink}>
            <div data-testid="dataset-line" className={viewDataset}>
              Dataset Details
              <FontAwesomeIcon icon={faArrowRight as IconProp} className={datasetArrow} />
            </div>
          </div>
        </Link>
      </Card>
    </MuiThemeProvider>
  )
}

export default withStyles(cardStyles)(HomeHighlightCard);
