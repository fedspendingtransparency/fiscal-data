import React from 'react';
import { navigate } from 'gatsby';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { theme } from '../../../theme';
import { card, card_headerLink } from '../../../components/dataset-card/dataset-card.module.scss';

const cardStyles = {
  root: {
    fontSize: 16,
  },
};

const HighlightCard = ({ classes, dataset }) => {
  const cardLink = `/datasets${dataset.slug}`;

  const clickHandler = () => {
    navigate(cardLink);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={card} onClick={() => clickHandler()} data-test-id="highlight-card">
        <CardActionArea classes={{ root: classes.root }}>
          <p className={card_headerLink}>What is the average interest rate on the Federal Debt?</p>
        </CardActionArea>
      </Card>
    </MuiThemeProvider>
  );
};

export default withStyles(cardStyles)(HighlightCard);
