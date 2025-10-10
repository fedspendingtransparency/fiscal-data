import React from 'react';
import { navigate } from 'gatsby';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../theme';
import { card, card_headerLink } from '../../../components/dataset-card/dataset-card.module.scss';

const HighlightCard = ({ classes, dataset }) => {
  const cardLink = `/datasets${dataset.slug}`;

  const clickHandler = () => {
    navigate(cardLink);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card className={card} onClick={() => clickHandler()} data-test-id="highlight-card">
        <CardActionArea classes={{ root: classes.root }}>
          <p className={card_headerLink}>What is the average interest rate on the Federal Debt?</p>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
};

export default HighlightCard;
