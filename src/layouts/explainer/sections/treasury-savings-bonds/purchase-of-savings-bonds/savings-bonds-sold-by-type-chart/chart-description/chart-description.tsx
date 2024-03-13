import React, { useState } from 'react';
import { listContainer, description, box, header } from './chart-description.module.scss';
import ScrollContainer from '../../../../../../../components/scroll-container/scroll-container';
import { savingsBondsMap } from '../savings-bonds-sold-by-type-chart-helper';

const ChartDescription = () => {
  const [scrollTop, setScrollTop] = useState(true);
  const [scrollBottom, setScrollBottom] = useState(false);
  const descriptionList = ['AD', 'E', 'EE', 'F', 'G', 'H', 'HH', 'I', 'J', 'K', 'SN'];
  return (
    <div style={{ display: 'block' }}>
      <ScrollContainer
        scrollTop={scrollTop}
        setScrollTop={setScrollTop}
        list={descriptionList}
        scrollBottom={scrollBottom}
        setScrollBottom={setScrollBottom}
        customContainerStyle={{ height: 'fit-content' }}
        gradientColor="#f1f1f1"
        testId="SavingsBondsChart"
      >
        <div className={listContainer}>
          {descriptionList.map((key, index) => {
            const bond = savingsBondsMap[key];
            return (
              <React.Fragment key={index}>
                <div className={header}>
                  <div className={box} style={{ backgroundColor: bond.color }} />
                  <h5>{bond.label}</h5>
                </div>
                <p className={description}>{bond.description}</p>
              </React.Fragment>
            );
          })}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default ChartDescription;
