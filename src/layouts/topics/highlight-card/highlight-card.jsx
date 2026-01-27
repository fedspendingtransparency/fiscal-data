import React from 'react';
import { navigate } from 'gatsby';

const HighlightCard = ({ dataset }) => {
  const cardLink = `/datasets${dataset.slug}`;

  const clickHandler = () => {
    navigate(cardLink);
  };

  return (
    <div>
      {/*<ThemeProvider theme={theme}>*/}
      {/*  <Card className={card} onClick={() => clickHandler()} data-test-id="highlight-card">*/}
      {/*    <CardActionArea sx={{ fontSize: 16 }}>*/}
      {/*      <p className={card_headerLink}>What is the average interest rate on the Federal Debt?</p>*/}
      {/*    </CardActionArea>*/}
      {/*  </Card>*/}
      {/*</ThemeProvider>*/}
    </div>
  );
};

export default HighlightCard;
